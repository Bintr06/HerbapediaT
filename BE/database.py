import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:123456@localhost:3306/herbapedia_db",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    display_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    avatar_public_id = Column(String(255), nullable=True)
    auth_provider = Column(String(20), nullable=True, default="password")
    role = Column(String(20), nullable=False, default="user")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    image_url = Column(String(1000), nullable=False)
    image_public_id = Column(String(255), nullable=True)
    predicted_class = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime, nullable=False)


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    post_type = Column(String(30), nullable=False, default="general")
    image_url = Column(String(1000), nullable=True)
    images_json = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False)


class CommunityComment(Base):
    __tablename__ = "community_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    parent_comment_id = Column(Integer, ForeignKey("community_comments.id"), nullable=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)


class CommunityLike(Base):
    __tablename__ = "community_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False)
    __table_args__ = (UniqueConstraint("post_id", "user_id", name="uq_community_like_post_user"),)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    recipient_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    actor_user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id"), nullable=True, index=True)
    comment_id = Column(Integer, ForeignKey("community_comments.id"), nullable=True, index=True)
    notification_type = Column(String(30), nullable=False)
    message = Column(String(500), nullable=False)
    is_read = Column(Boolean, nullable=False, default=False, index=True)
    created_at = Column(DateTime, nullable=False)


class Herb(Base):
    __tablename__ = "herbs"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    dataset_name = Column(String(100), unique=True, nullable=False, index=True)
    name_vi = Column(String(255), nullable=False)
    scientific_name = Column(String(255), nullable=False)
    image_url = Column(String(1000), nullable=True)
    image_public_id = Column(String(255), nullable=True)
    tags_json = Column(Text, nullable=False, default="[]")
    usage = Column(Text, nullable=False)
    parts_used = Column(Text, nullable=False)
    identification = Column(Text, nullable=False)
    safety = Column(Text, nullable=False)
    habitat = Column(Text, nullable=True)
    preparation = Column(Text, nullable=True)
    caution = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)


class HerbUsage(Base):
    __tablename__ = "herb_usages"

    id = Column(Integer, primary_key=True, index=True)
    herb_id = Column(Integer, ForeignKey("herbs.id"), nullable=False, index=True)
    usage_text = Column(Text, nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)


class HerbRemedy(Base):
    __tablename__ = "herb_remedies"

    id = Column(Integer, primary_key=True, index=True)
    herb_id = Column(Integer, ForeignKey("herbs.id"), nullable=False, index=True)
    remedy_text = Column(Text, nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)


class HerbReview(Base):
    __tablename__ = "herb_reviews"

    id = Column(Integer, primary_key=True, index=True)
    herb_id = Column(Integer, ForeignKey("herbs.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)
    content = Column(String(500), nullable=False)
    created_at = Column(DateTime, nullable=False)
    __table_args__ = (
        UniqueConstraint("herb_id", "user_id", name="uq_herb_review_herb_user"),
    )


class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), nullable=False, index=True)
    otp_code = Column(String(10), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False)


def init_db():
    Base.metadata.create_all(bind=engine)
    _migrate_users_table()
    _migrate_community_tables()
    _migrate_herb_table()
    _seed_herbs()


def _seed_herbs():
    import json
    from pathlib import Path

    seed_path = Path(__file__).with_name("herb_seed.json")
    if not seed_path.exists():
        return

    db = SessionLocal()
    try:
        existing_slugs = {h.slug for h in db.query(Herb.slug).all()}
        records = json.loads(seed_path.read_text(encoding="utf-8"))
        now = datetime.now(timezone.utc)
        added = False
        for record in records:
            slug = record["id"]
            if slug in existing_slugs:
                continue
            herb = Herb(
                slug=slug,
                dataset_name=record["datasetName"],
                name_vi=record["name"],
                scientific_name=record["scientific"],
                image_url=record.get("image"),
                tags_json=json.dumps(record.get("tags", []), ensure_ascii=False),
                usage=record["usage"],
                parts_used=record["parts"],
                identification=record["identification"],
                safety=record["safety"],
                habitat=record.get("habitat"),
                preparation=record.get("preparation"),
                caution=record.get("caution"),
                created_at=now,
                updated_at=now,
            )
            db.add(herb)
            db.flush()
            for index, usage_text in enumerate(record.get("usageDetails", [])):
                db.add(HerbUsage(herb_id=herb.id, usage_text=usage_text, sort_order=index))
            for index, remedy_text in enumerate(record.get("remedies", [])):
                db.add(HerbRemedy(herb_id=herb.id, remedy_text=remedy_text, sort_order=index))
        db.commit()
    finally:
        db.close()


def _migrate_users_table():
    inspector = inspect(engine)
    existing_columns = {
        column["name"] for column in inspector.get_columns(User.__tablename__)
    }
    user_table = User.__table__
    preparer = engine.dialect.identifier_preparer
    quoted_table_name = preparer.quote(user_table.name)

    with engine.begin() as connection:
        for column_name in (
            "display_name",
            "phone",
            "avatar_url",
            "avatar_public_id",
            "auth_provider",
            "created_at",
            "updated_at",
            "role",
            "is_active",
        ):
            if column_name not in existing_columns:
                column = user_table.c[column_name]
                quoted_column_name = preparer.quote(column.name)
                column_type = column.type.compile(dialect=engine.dialect)
                connection.execute(
                    text(
                        f"ALTER TABLE {quoted_table_name} "
                        f"ADD COLUMN {quoted_column_name} {column_type}"
                    )
                )
        connection.execute(
            user_table.update()
            .where(user_table.c.auth_provider.is_(None))
            .values(auth_provider="password")
        )
        connection.execute(
            user_table.update()
            .where(user_table.c.role.is_(None))
            .values(role="user")
        )
        connection.execute(
            user_table.update()
            .where(user_table.c.is_active.is_(None))
            .values(is_active=True)
        )


def _migrate_herb_table():
    inspector = inspect(engine)
    existing_columns = {
        column["name"] for column in inspector.get_columns(Herb.__tablename__)
    }
    herb_table = Herb.__table__
    preparer = engine.dialect.identifier_preparer
    quoted_table_name = preparer.quote(herb_table.name)

    with engine.begin() as connection:
        if "image_public_id" not in existing_columns:
            column = herb_table.c.image_public_id
            quoted_column_name = preparer.quote(column.name)
            column_type = column.type.compile(dialect=engine.dialect)
            connection.execute(
                text(
                    f"ALTER TABLE {quoted_table_name} "
                    f"ADD COLUMN {quoted_column_name} {column_type}"
                )
            )
def _migrate_community_tables():
    inspector = inspect(engine)
    post_columns = {
        column["name"]
        for column in inspector.get_columns(CommunityPost.__tablename__)
    }
    post_table = CommunityPost.__table__
    comment_columns = {
        column["name"]
        for column in inspector.get_columns(CommunityComment.__tablename__)
    }
    comment_table = CommunityComment.__table__
    preparer = engine.dialect.identifier_preparer

    with engine.begin() as connection:
        if "images_json" not in post_columns:
            column = post_table.c.images_json
            connection.execute(
                text(
                    f"ALTER TABLE {preparer.quote(post_table.name)} "
                    f"ADD COLUMN {preparer.quote(column.name)} "
                    f"{column.type.compile(dialect=engine.dialect)}"
                )
            )
        if "parent_comment_id" not in comment_columns:
            column = comment_table.c.parent_comment_id
            connection.execute(
                text(
                    f"ALTER TABLE {preparer.quote(comment_table.name)} "
                    f"ADD COLUMN {preparer.quote(column.name)} "
                    f"{column.type.compile(dialect=engine.dialect)}"
                )
            )
