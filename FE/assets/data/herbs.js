(function () {
    const defaultImage = 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80';
    const leafImage = 'https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f?auto=format&fit=crop&w=900&q=80';
    const flowerImage = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80';
    const fruitImage = 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80';

    window.HerbaPediaHerbs = [
        { id: 'aloevera', datasetName: 'Aloevera', name: 'Lô hội (Nha đam)', scientific: 'Aloe vera (L.) Burm.f.', image: leafImage, tags: ['thanh nhiệt', 'làm đẹp'], usage: 'Làm dịu da và hỗ trợ chăm sóc da bên ngoài.', parts: 'Gel trong lá', identification: 'Cây mọng nước, lá dài hình mũi mác, mép có răng cưa nhỏ.', remedies: ['Gel nha đam dùng ngoài da sau khi đã sơ chế sạch.'], safety: 'Không bôi gel chưa sơ chế lên vết thương hở; không tự ý dùng đường uống liều cao.' },
        { id: 'betel', datasetName: 'Betel', name: 'Trầu không', scientific: 'Piper betle L.', image: leafImage, tags: ['kháng viêm', 'tiêu hóa'], usage: 'Lá thường được dùng trong kinh nghiệm dân gian để vệ sinh và làm ấm.', parts: 'Lá', identification: 'Dây leo, lá hình tim, mặt lá bóng và có mùi thơm đặc trưng.', remedies: ['Nước lá trầu không đã đun sôi dùng ngoài theo hướng dẫn phù hợp.'], safety: 'Chỉ dùng ngoài da khi chưa có tư vấn chuyên môn; ngừng dùng nếu kích ứng.' },
        { id: 'bhrami', datasetName: 'Bhrami', name: 'Rau đắng biển (Brahmi)', scientific: 'Bacopa monnieri (L.) Wettst.', image: leafImage, tags: ['an thần', 'thanh nhiệt'], usage: 'Được nghiên cứu trong lĩnh vực hỗ trợ trí nhớ và thư giãn.', parts: 'Toàn cây', identification: 'Thân bò, lá mọng nước nhỏ, hoa trắng hoặc tím nhạt.', remedies: ['Chỉ sử dụng chế phẩm có nguồn gốc rõ ràng theo tư vấn chuyên môn.'], safety: 'Có thể gây khó chịu tiêu hóa và tương tác thuốc; không tự dùng liều cao.' },
        { id: 'bringaraja', datasetName: 'Bringaraja', name: 'Nhọ nồi (Cỏ mực)', scientific: 'Eclipta prostrata (L.) L.', image: leafImage, tags: ['cầm máu', 'giải độc'], usage: 'Dùng trong một số bài thuốc dân gian, cần phân biệt với cây khác.', parts: 'Toàn cây', identification: 'Thân thảo, lá mọc đối, cụm hoa nhỏ màu trắng ở đầu cành.', remedies: ['Không tự đắp cây tươi lên vết thương sâu hoặc đang chảy máu nhiều.'], safety: 'Chảy máu nhiều cần đến cơ sở y tế; đảm bảo cây được nhận diện chính xác.' },
        { id: 'castor', datasetName: 'Castor', name: 'Thầu dầu', scientific: 'Ricinus communis L.', image: leafImage, tags: ['tiêu hóa'], usage: 'Hạt và lá có ứng dụng truyền thống nhưng cây có độc tính đáng lưu ý.', parts: 'Dầu đã tinh chế theo chuẩn; không dùng hạt sống', identification: 'Lá xẻ chân vịt lớn, quả có gai mềm, hạt có vân loang.', remedies: ['Không tự chế biến hạt thầu dầu tại nhà.'], safety: 'Hạt sống rất độc, đặc biệt nguy hiểm với trẻ em; không dùng tùy tiện.' },
        { id: 'catharanthus', datasetName: 'Catharanthus', name: 'Dừa cạn', scientific: 'Catharanthus roseus (L.) G.Don', image: flowerImage, tags: ['kháng viêm'], usage: 'Cây cảnh và dược liệu nghiên cứu; hoạt chất cần được kiểm soát nghiêm ngặt.', parts: 'Không tự dùng toàn cây', identification: 'Cây bụi nhỏ, lá đối hình bầu dục, hoa năm cánh màu trắng hoặc hồng.', remedies: ['Không dùng làm thuốc tại nhà.'], safety: 'Có hoạt chất độc và tương tác thuốc; chỉ dùng sản phẩm được kê hoặc kiểm nghiệm.' },
        { id: 'chilly', datasetName: 'Chilly', name: 'Ớt', scientific: 'Capsicum annuum L.', image: fruitImage, tags: ['tiêu hóa', 'kháng viêm'], usage: 'Gia vị phổ biến; capsaicin được dùng trong một số sản phẩm bôi ngoài da.', parts: 'Quả', identification: 'Cây thân thảo, quả nhiều hình dạng, khi chín thường chuyển đỏ.', remedies: ['Dùng lượng vừa phải trong chế độ ăn; tránh bôi ớt tươi lên da.'], safety: 'Có thể gây kích ứng dạ dày, da và mắt.' },
        { id: 'citron-lime', datasetName: 'Citron lime (herelikai)', name: 'Chanh ta', scientific: 'Citrus aurantiifolia (Christm.) Swingle', image: fruitImage, tags: ['tiêu hóa', 'giải độc'], usage: 'Quả dùng làm gia vị và bổ sung hương vị cho đồ uống.', parts: 'Quả', identification: 'Cây có gai, lá xanh bóng, quả nhỏ tròn màu xanh đến vàng.', remedies: ['Nước chanh pha loãng dùng như đồ uống thông thường.'], safety: 'Nước chanh đậm đặc có thể kích ứng dạ dày và làm nhạy cảm da với nắng.' },
        { id: 'coffee', datasetName: 'Coffee', name: 'Cà phê', scientific: 'Coffea arabica L.', image: fruitImage, tags: ['thanh nhiệt'], usage: 'Hạt rang tạo đồ uống chứa caffeine, dùng với lượng phù hợp.', parts: 'Hạt rang', identification: 'Cây bụi thường xanh, quả chín đỏ, bên trong có hai hạt.', remedies: ['Ưu tiên đồ uống ít đường và tránh dùng sát giờ ngủ.'], safety: 'Caffeine có thể gây mất ngủ, hồi hộp; người mang thai cần giới hạn theo tư vấn.' },
        { id: 'coriender', datasetName: 'Coriender', name: 'Rau mùi (Ngò rí)', scientific: 'Coriandrum sativum L.', image: leafImage, tags: ['tiêu hóa'], usage: 'Rau gia vị giúp tăng hương vị món ăn.', parts: 'Lá và hạt', identification: 'Cây thân thảo nhỏ, lá xẻ, mùi thơm đặc trưng.', remedies: ['Dùng như rau gia vị và rửa sạch trước khi ăn.'], safety: 'Có thể gây dị ứng ở một số người.' },
        { id: 'curry', datasetName: 'Curry', name: 'Lá cà ri', scientific: 'Murraya koenigii (L.) Spreng.', image: leafImage, tags: ['tiêu hóa'], usage: 'Lá thơm dùng làm gia vị trong nhiều món ăn.', parts: 'Lá', identification: 'Cây bụi nhỏ, lá kép lông chim, mùi thơm khi vò.', remedies: ['Dùng làm gia vị trong khẩu phần thông thường.'], safety: 'Không thay thế thuốc điều trị rối loạn đường huyết.' },
        { id: 'doddpathre', datasetName: 'Doddpathre', name: 'Rau tần dày lá (Húng chanh)', scientific: 'Coleus amboinicus Lour.', image: leafImage, tags: ['kháng viêm', 'tiêu hóa'], usage: 'Lá thơm thường dùng trong các món ăn và kinh nghiệm dân gian.', parts: 'Lá', identification: 'Lá dày, mọng nước, mép có răng cưa, mùi thơm mạnh.', remedies: ['Có thể dùng như rau thơm sau khi rửa sạch.'], safety: 'Không tự dùng tinh dầu đậm đặc cho trẻ nhỏ.' },
        { id: 'drumstick', datasetName: 'Drumstick', name: 'Chùm ngây', scientific: 'Moringa oleifera Lam.', image: leafImage, tags: ['thanh nhiệt', 'tiêu hóa'], usage: 'Lá và quả là thực phẩm giàu dinh dưỡng.', parts: 'Lá và quả non', identification: 'Cây thân gỗ nhỏ, lá kép nhỏ, quả dài giống hình que.', remedies: ['Dùng như rau trong bữa ăn, chế biến chín.'], safety: 'Không dùng rễ hoặc vỏ cây tùy tiện; phụ nữ mang thai cần thận trọng.' },
        { id: 'eucalyptus', datasetName: 'Eucalyptus', name: 'Bạch đàn (Khuynh diệp)', scientific: 'Eucalyptus globulus Labill.', image: leafImage, tags: ['kháng viêm'], usage: 'Tinh dầu được dùng trong một số sản phẩm hô hấp và vệ sinh ngoài da.', parts: 'Lá đã xử lý, tinh dầu chuẩn hóa', identification: 'Cây thân gỗ, lá dài, mùi tinh dầu rõ khi vò.', remedies: ['Chỉ dùng sản phẩm tinh dầu có hướng dẫn rõ ràng.'], safety: 'Không uống tinh dầu; tránh xa trẻ nhỏ và không bôi nguyên chất.' },
        { id: 'ginger', datasetName: 'Ginger', name: 'Gừng', scientific: 'Zingiber officinale Roscoe', image: leafImage, tags: ['tiêu hóa', 'kháng viêm'], usage: 'Thân rễ dùng làm gia vị và đồ uống ấm.', parts: 'Thân rễ', identification: 'Thân rễ phân nhánh, mùi cay thơm, lá dài mọc thành bụi.', remedies: ['Trà gừng loãng dùng như đồ uống thông thường.'], safety: 'Dùng nhiều có thể gây nóng rát; người dùng thuốc chống đông cần hỏi bác sĩ.' },
        { id: 'guava', datasetName: 'Guava', name: 'Ổi', scientific: 'Psidium guajava L.', image: fruitImage, tags: ['tiêu hóa', 'cầm máu'], usage: 'Quả là thực phẩm giàu chất xơ; lá có ứng dụng dân gian.', parts: 'Quả và lá', identification: 'Cây thân gỗ nhỏ, vỏ trơn, quả tròn hoặc hình quả lê.', remedies: ['Ưu tiên ăn quả chín đã rửa sạch.'], safety: 'Không dùng lá thay thế thuốc điều trị tiêu chảy hoặc bệnh lý khác.' },
        { id: 'henna', datasetName: 'Henna', name: 'Móng tay (Lá móng)', scientific: 'Lawsonia inermis L.', image: flowerImage, tags: ['làm đẹp'], usage: 'Lá nghiền được dùng làm màu nhuộm tự nhiên trong làm đẹp.', parts: 'Lá', identification: 'Cây bụi, lá nhỏ mọc đối, hoa nhỏ thơm màu trắng.', remedies: ['Chỉ dùng sản phẩm nhuộm có thành phần và nguồn gốc rõ ràng.'], safety: 'Tránh “henna đen” có thể chứa PPD gây dị ứng nặng.' },
        { id: 'hibiscus', datasetName: 'Hibiscus', name: 'Dâm bụt', scientific: 'Hibiscus rosa-sinensis L.', image: flowerImage, tags: ['thanh nhiệt'], usage: 'Cây hoa phổ biến; cánh hoa được dùng trong một số thức uống và mỹ phẩm.', parts: 'Hoa đã xác định đúng loài', identification: 'Cây bụi, hoa lớn nhiều màu, nhị tạo thành trụ dài.', remedies: ['Không tự dùng hoa cây cảnh làm thuốc uống.'], safety: 'Cần phân biệt với bụp giấm và các loài Hibiscus khác.' },
        { id: 'jackfruit', datasetName: 'Jackfruit', name: 'Mít', scientific: 'Artocarpus heterophyllus Lam.', image: fruitImage, tags: ['tiêu hóa'], usage: 'Quả là thực phẩm phổ biến, giàu năng lượng và chất xơ.', parts: 'Múi quả và hạt đã nấu chín', identification: 'Cây gỗ lớn, quả to có vỏ gai, múi vàng khi chín.', remedies: ['Ăn lượng vừa phải, đặc biệt với người cần kiểm soát đường huyết.'], safety: 'Có thể gây đầy bụng hoặc dị ứng ở một số người.' },
        { id: 'jasmine', datasetName: 'Jasmine', name: 'Hoa nhài (Hoa lài)', scientific: 'Jasminum sambac (L.) Aiton', image: flowerImage, tags: ['an thần', 'thanh nhiệt'], usage: 'Hoa thơm dùng ướp trà và trong các sản phẩm hương liệu.', parts: 'Hoa', identification: 'Cây bụi hoặc dây leo, hoa trắng thơm, thường nở về đêm.', remedies: ['Dùng hoa sạch để ướp trà, không dùng hoa phun hóa chất.'], safety: 'Không khẳng định tác dụng điều trị từ trà hoa.' },
        { id: 'lantana', datasetName: 'Lantana', name: 'Ngũ sắc (Trâm ổi)', scientific: 'Lantana camara L.', image: flowerImage, tags: ['kháng viêm'], usage: 'Cây cảnh; một số bộ phận có độc tính và không nên tự dùng.', parts: 'Không tự dùng làm thuốc', identification: 'Cụm hoa nhiều màu, lá nhám, mùi hăng khi vò.', remedies: ['Không dùng quả hoặc lá để uống.'], safety: 'Quả xanh và các bộ phận của cây có thể gây độc.' },
        { id: 'lemon', datasetName: 'Lemon', name: 'Chanh vàng', scientific: 'Citrus limon (L.) Osbeck', image: fruitImage, tags: ['tiêu hóa', 'giải độc'], usage: 'Quả dùng làm gia vị, nước uống và tạo hương vị.', parts: 'Quả và vỏ đã làm sạch', identification: 'Cây có gai, quả vàng hình bầu dục, vỏ có tinh dầu thơm.', remedies: ['Dùng nước chanh pha loãng trong khẩu phần phù hợp.'], safety: 'Axit có thể làm mòn men răng và kích ứng dạ dày.' },
        { id: 'lemongrass', datasetName: 'Lemongrass', name: 'Sả', scientific: 'Cymbopogon citratus (DC.) Stapf', image: leafImage, tags: ['tiêu hóa', 'kháng viêm'], usage: 'Thân giả thơm dùng làm gia vị và trà.', parts: 'Thân giả', identification: 'Cây mọc thành bụi, lá dài, mùi chanh rõ.', remedies: ['Dùng làm gia vị hoặc trà loãng, không lạm dụng tinh dầu.'], safety: 'Tinh dầu đậm đặc có thể gây kích ứng và độc khi uống.' },
        { id: 'malabar-spinach', datasetName: 'Malabar_Spinach', name: 'Rau mồng tơi', scientific: 'Basella alba L.', image: leafImage, tags: ['tiêu hóa', 'thanh nhiệt'], usage: 'Rau ăn lá giàu chất nhầy và chất xơ.', parts: 'Lá và ngọn non', identification: 'Dây leo mềm, lá dày hình tim, thân có thể xanh hoặc tím.', remedies: ['Nấu chín như rau trong bữa ăn.'], safety: 'Rửa sạch và không dùng rau đã úa hoặc nhiễm hóa chất.' },
        { id: 'mango', datasetName: 'Mango', name: 'Xoài', scientific: 'Mangifera indica L.', image: fruitImage, tags: ['tiêu hóa'], usage: 'Quả là thực phẩm phổ biến, có nhiều giống và độ chua ngọt khác nhau.', parts: 'Quả chín', identification: 'Cây gỗ lớn, lá dài bóng, quả hình thận hoặc bầu dục.', remedies: ['Ăn quả chín với lượng phù hợp.'], safety: 'Có thể dị ứng với nhựa vỏ hoặc gây tăng đường huyết khi ăn nhiều.' },
        { id: 'marigold', datasetName: 'Marigold', name: 'Hoa vạn thọ', scientific: 'Tagetes erecta L.', image: flowerImage, tags: ['kháng viêm'], usage: 'Hoa cảnh; cánh hoa được dùng tạo màu trong một số sản phẩm.', parts: 'Hoa đã xác định nguồn', identification: 'Cây thân thảo, hoa kép màu vàng hoặc cam, mùi đặc trưng.', remedies: ['Không tự dùng hoa trồng cảnh nếu chưa rõ hóa chất bảo vệ thực vật.'], safety: 'Có thể gây dị ứng da hoặc dị ứng phấn hoa.' },
        { id: 'mint', datasetName: 'Mint', name: 'Bạc hà', scientific: 'Mentha × piperita L.', image: leafImage, tags: ['tiêu hóa', 'thanh nhiệt'], usage: 'Lá thơm dùng trong đồ uống và món ăn.', parts: 'Lá', identification: 'Thân vuông, lá có răng cưa, mùi the mát.', remedies: ['Dùng lá tươi đã rửa sạch trong đồ ăn hoặc trà loãng.'], safety: 'Không dùng tinh dầu bạc hà nguyên chất cho trẻ nhỏ.' },
        { id: 'neem', datasetName: 'Neem', name: 'Xoan Ấn Độ (Sầu đâu)', scientific: 'Azadirachta indica A.Juss.', image: leafImage, tags: ['kháng viêm'], usage: 'Cây được dùng trong nghiên cứu và sản phẩm chăm sóc ngoài da.', parts: 'Lá hoặc dầu đã chuẩn hóa', identification: 'Cây gỗ, lá kép lông chim, vị rất đắng.', remedies: ['Không tự uống lá hoặc dầu neem.'], safety: 'Có thể độc với gan và không phù hợp cho trẻ em, phụ nữ mang thai.' },
        { id: 'nelavembu', datasetName: 'Nelavembu', name: 'Xuyên tâm liên', scientific: 'Andrographis paniculata (Burm.f.) Nees', image: flowerImage, tags: ['giải độc', 'kháng viêm'], usage: 'Dược liệu vị rất đắng, thường xuất hiện trong sản phẩm đã chuẩn hóa.', parts: 'Phần trên mặt đất', identification: 'Cây thân thảo nhỏ, lá thuôn, hoa trắng có đốm tím.', remedies: ['Chỉ dùng chế phẩm có liều lượng và nguồn gốc rõ ràng.'], safety: 'Có thể gây dị ứng và tương tác thuốc; không tự dùng kéo dài.' },
        { id: 'nooni', datasetName: 'Nooni', name: 'Nhàu', scientific: 'Morinda citrifolia L.', image: fruitImage, tags: ['tiêu hóa', 'kháng viêm'], usage: 'Quả và sản phẩm từ nhàu được dùng theo kinh nghiệm dân gian.', parts: 'Quả chín hoặc chế phẩm chuẩn hóa', identification: 'Cây bụi, lá lớn bóng, quả ghép màu trắng ngà khi chín.', remedies: ['Chọn sản phẩm có nhãn và nguồn gốc rõ ràng.'], safety: 'Có thể ảnh hưởng gan, thận hoặc tương tác thuốc ở một số người.' },
        { id: 'onion', datasetName: 'Onion', name: 'Hành', scientific: 'Allium cepa L.', image: fruitImage, tags: ['tiêu hóa', 'kháng viêm'], usage: 'Củ là gia vị và thực phẩm phổ biến.', parts: 'Củ', identification: 'Cây thân hành, củ nhiều lớp vỏ, lá rỗng hình ống.', remedies: ['Dùng trong món ăn sau khi nấu hoặc sơ chế sạch.'], safety: 'Có thể gây đầy hơi hoặc dị ứng; không thay thuốc điều trị.' },
        { id: 'papaya', datasetName: 'Papaya', name: 'Đu đủ', scientific: 'Carica papaya L.', image: fruitImage, tags: ['tiêu hóa', 'thanh nhiệt'], usage: 'Quả chín là thực phẩm giàu dinh dưỡng và chất xơ.', parts: 'Quả chín', identification: 'Thân mềm có sẹo lá, lá xẻ lớn, quả mọc quanh thân.', remedies: ['Ăn quả chín đã rửa và gọt sạch.'], safety: 'Mủ và hạt không nên tự dùng; người dị ứng latex cần thận trọng.' },
        { id: 'tomato', datasetName: 'Tomato', name: 'Cà chua', scientific: 'Solanum lycopersicum L.', image: fruitImage, tags: ['thanh nhiệt', 'tiêu hóa'], usage: 'Quả giàu nước và thường dùng trong bữa ăn.', parts: 'Quả chín', identification: 'Cây thân mềm có lông, quả tròn hoặc dài, chuyển đỏ khi chín.', remedies: ['Dùng quả chín, rửa sạch và chế biến phù hợp.'], safety: 'Không ăn nhiều lá hoặc quả còn xanh; có thể gây khó chịu tiêu hóa.' },
        { id: 'tulsi', datasetName: 'Tulsi', name: 'Húng quế thánh (Hương nhu tía)', scientific: 'Ocimum tenuiflorum L.', image: flowerImage, tags: ['kháng viêm', 'tiêu hóa'], usage: 'Lá thơm dùng làm gia vị và trà trong nhiều nền văn hóa.', parts: 'Lá và ngọn', identification: 'Thân vuông, lá thơm, có thể có màu xanh hoặc tím, hoa mọc thành chùm.', remedies: ['Dùng như rau thơm hoặc trà loãng từ nguyên liệu sạch.'], safety: 'Không dùng tinh dầu đậm đặc hoặc thay thế thuốc kê đơn.' },
        { id: 'pepper', datasetName: 'Pepper', name: 'Hồ tiêu (Tiêu)', scientific: 'Piper nigrum L.', image: leafImage, tags: ['tiêu hóa', 'kháng viêm'], usage: 'Gia vị cay ấm kích thích tiêu hóa và làm ấm tỳ vị.', parts: 'Quả (hạt tiêu đen, tiêu sọ)', identification: 'Dây leo thân gỗ, lá hình trái xoan, quả mọc thành chuỗi dài.', remedies: ['Dùng làm gia vị món ăn hàng ngày lượng vừa phải.'], safety: 'Người bị viêm loét dạ dày tá tràng nên hạn chế dùng lượng lớn.' },
        { id: 'rose', datasetName: 'Rose', name: 'Hoa hồng', scientific: 'Rosa chinensis Jacq.', image: flowerImage, tags: ['làm đẹp', 'thanh nhiệt'], usage: 'Cánh hoa dùng làm trà thanh nhiệt, dưỡng nhan và làm dịu tinh thần.', parts: 'Nụ hoa, cánh hoa', identification: 'Cây bụi có gai nhọn, hoa nhiều cánh thơm dịu.', remedies: ['Trà nụ hoa hồng sấy khô hãm nước nóng uống thư giãn.'], safety: 'Chỉ dùng hoa trồng hữu cơ làm trà, không dùng hoa phun hóa chất.' },
        { id: 'bitter-gourd', datasetName: 'Bitter Gourd', name: 'Khổ qua (Mướp đắng)', scientific: 'Momordica charantia L.', image: leafImage, tags: ['thanh nhiệt', 'giải độc'], usage: 'Quả và dây lá có vị đắng tính hàn, giúp thanh nhiệt, giải độc.', parts: 'Quả, lá và dây khổ qua', identification: 'Dây leo có tua cuốn, lá xẻ thùy sâu 5-7 thùy, quả có u lồi sần sùi.', remedies: ['Chế biến thành món ăn thanh mát hoặc pha trà khổ qua sấy khô.'], safety: 'Không lạm dụng nước ép sống liều cao; phụ nữ mang thai cần thận trọng.' },
        { id: 'centella-asiatica', datasetName: 'Centella asiatica', name: 'Rau má', scientific: 'Centella asiatica (L.) Urb.', image: leafImage, tags: ['thanh nhiệt', 'giải độc', 'làm đẹp'], usage: 'Thảo mộc thanh nhiệt, giải độc, làm mát gan và hỗ trợ phục hồi da.', parts: 'Toàn cây (lá và thân bò)', identification: 'Thân thảo mọc bò sát đất, lá hình thận có khía tai bèo đều ở mép.', remedies: ['Nước rau má tươi rửa sạch xay loãng hoặc canh rau má thanh nhiệt.'], safety: 'Rửa thật kỹ vì cây mọc sát đất; không uống quá nhiều liên tục.' },
        { id: 'grape', datasetName: 'Grape', name: 'Nho', scientific: 'Vitis vinifera L.', image: fruitImage, tags: ['thanh nhiệt', 'làm đẹp'], usage: 'Quả giàu chất chống oxy hóa polyphenol, resveratrol.', parts: 'Quả chín, hạt nho và lá non', identification: 'Dây leo thân gỗ có tua cuốn, lá to xẻ 3-5 thùy có răng cưa.', remedies: ['Dùng quả nho chín rửa sạch như trái cây bổ sung vitamin.'], safety: 'Rửa kỹ vỏ quả; người tiểu đường cần kiểm soát khẩu phần ăn.' },
        { id: 'orange', datasetName: 'Orange', name: 'Cam', scientific: 'Citrus × sinensis (L.) Osbeck', image: fruitImage, tags: ['thanh nhiệt', 'tiêu hóa'], usage: 'Quả giàu vitamin C tăng đề kháng; vỏ cam khô hỗ trợ tiêu hóa.', parts: 'Quả chín và vỏ quả phơi khô', identification: 'Cây gỗ nhỏ thường xanh, cuống lá có cánh nhỏ đặc trưng, quả hình cầu.', remedies: ['Nước cam tươi bổ sung vitamin C hoặc trà vỏ cam khô ấm bụng.'], safety: 'Không uống nước cam chua khi bụng đói.' },
        { id: 'snakeplant', datasetName: 'Snakeplant', name: 'Lưỡi hổ', scientific: 'Dracaena trifasciata (Prain) Mabb.', image: defaultImage, tags: ['kháng viêm'], usage: 'Cây cảnh thanh lọc không khí; không tự dùng đường uống.', parts: 'Chủ yếu trồng làm cảnh', identification: 'Lá mọc thẳng cứng và mọng, mặt lá có vằn ngang xanh đậm nhạt, viền vàng.', remedies: ['Trồng làm cây cảnh lọc không khí; không tự ý giã lá uống.'], safety: 'Lá chứa saponin gây kích ứng miệng và tiêu hóa nếu nuốt phải.' },
        { id: 'tea', datasetName: 'Tea', name: 'Trà xanh (Chè xanh)', scientific: 'Camellia sinensis (L.) Kuntze', image: leafImage, tags: ['thanh nhiệt', 'kháng viêm', 'giải độc'], usage: 'Lá giàu catechin (EGCG) giúp tỉnh táo, chống oxy hóa và thanh nhiệt.', parts: 'Búp và lá bánh tẻ', identification: 'Cây bụi thường xanh, lá hình bầu dục dày bóng, mép có răng cưa nhỏ đều.', remedies: ['Lá chè xanh tươi rửa sạch vò nhẹ, hãm nước sôi 80-85°C.'], safety: 'Không uống trà đặc khi bụng đói hoặc sát giờ đi ngủ.' }
    ];

    const extendedDetails = {
        aloevera: ['Vùng khô nóng; trồng làm cảnh và làm nguyên liệu mỹ phẩm.', 'Rửa sạch, bỏ nhựa vàng và chỉ lấy phần gel trong; ưu tiên sản phẩm đã chuẩn hóa.', 'Gel dùng ngoài da không thay thế điều trị bỏng, viêm da hoặc vết thương.'],
        betel: ['Vùng nhiệt đới ẩm; thường được trồng cạnh giàn leo.', 'Lá rửa sạch, có thể dùng trong ẩm thực hoặc đun nước dùng ngoài theo hướng dẫn.', 'Không thụt rửa hoặc dùng kéo dài cho bệnh phụ khoa khi chưa khám.'],
        bhrami: ['Đầm lầy, bờ ruộng và vùng đất ẩm.', 'Chỉ dùng cao hoặc viên có công bố thành phần, liều lượng và nguồn gốc.', 'Người đang dùng thuốc an thần, tuyến giáp hoặc thuốc mạn tính nên hỏi bác sĩ.'],
        bringaraja: ['Nơi ẩm, bãi cỏ và ruộng; thường mọc sát mặt đất.', 'Dược liệu cần được làm sạch, định danh và bào chế đúng; không dùng cây tươi tùy tiện.', 'Không dùng để xử trí vết thương sâu, chảy máu nhiều hoặc vàng da chưa rõ nguyên nhân.'],
        castor: ['Cây bụi vùng nhiệt đới, hạt có vân đặc trưng.', 'Chỉ sử dụng dầu dược dụng đã tinh chế theo nhãn sản phẩm.', 'Ricin trong hạt có thể gây ngộ độc nặng; không nghiền, nấu hoặc cho trẻ tiếp xúc.'],
        catharanthus: ['Cây cảnh chịu nắng, có hoa quanh năm ở vùng ấm.', 'Không tự sắc uống; hoạt chất dùng trong y khoa phải do cơ sở chuyên môn kiểm soát.', 'Toàn cây có thể độc và không được dùng thay thuốc điều trị ung thư.'],
        chilly: ['Cây gia vị ưa sáng, quả có nhiều giống và mức cay khác nhau.', 'Dùng như gia vị; chế phẩm capsaicin bôi ngoài phải theo đúng hướng dẫn.', 'Tránh mắt, niêm mạc và da trầy; ngừng dùng khi bỏng rát kéo dài.'],
        'citron-lime': ['Cây ăn quả vùng nhiệt đới, quả xanh hoặc vàng tùy độ chín.', 'Pha loãng nước quả; rửa vỏ trước khi bào hoặc sử dụng tinh dầu.', 'Không dùng nước chanh để xử trí bệnh dạ dày; tránh nắng sau khi dính tinh dầu vỏ lên da.'],
        coffee: ['Cây bụi vùng cao nguyên; quả chín thường đỏ hoặc vàng.', 'Uống lượng vừa phải, hạn chế đường và không dùng sát giờ ngủ.', 'Người nhạy cảm caffeine, trẻ em và phụ nữ mang thai cần giới hạn lượng dùng.'],
        coriender: ['Rau gia vị ngắn ngày, thích hợp khí hậu mát.', 'Rửa dưới vòi nước sạch và dùng tươi hoặc nấu chín.', 'Dị ứng rau mùi có thể gây ngứa, nổi mề đay hoặc khó thở.'],
        curry: ['Cây bụi nhiệt đới; lá kép có mùi thơm khi vò.', 'Dùng lá làm gia vị, không tự sắc lá để điều trị tiểu đường.', 'Người dùng thuốc hạ đường huyết cần theo dõi và hỏi nhân viên y tế.'],
        doddpathre: ['Cây mọng nước, dễ trồng ở nơi có nắng nhẹ.', 'Rửa sạch lá rồi dùng như rau thơm; tránh tự nhỏ nước lá vào mũi hoặc tai.', 'Tinh dầu đậm đặc có thể kích ứng đường hô hấp và da trẻ nhỏ.'],
        drumstick: ['Cây chịu hạn, phát triển tốt ở vùng nhiệt đới.', 'Lá và quả non nấu chín như rau; không dùng rễ, vỏ cây làm thức uống.', 'Phụ nữ mang thai nên tránh chế phẩm cô đặc từ rễ hoặc vỏ.'],
        eucalyptus: ['Cây thân gỗ, thường trồng lấy gỗ và tinh dầu.', 'Chỉ dùng dầu hoặc thuốc xoa có nồng độ, hướng dẫn và nguồn gốc rõ ràng.', 'Không uống tinh dầu; tránh bôi gần mũi, miệng trẻ nhỏ hoặc dùng máy xông kín.'],
        ginger: ['Thân rễ phát triển dưới đất ở vùng ấm, thu hoạch khi đủ già.', 'Rửa sạch, thái lát dùng trong món ăn hoặc trà loãng; không lạm dụng dạng cô đặc.', 'Có thể làm tăng nguy cơ chảy máu khi dùng cùng một số thuốc chống đông.'],
        guava: ['Cây ăn quả nhiệt đới, thích nghi nhiều loại đất.', 'Ăn quả chín đã rửa sạch; lá chỉ dùng trong sản phẩm có hướng dẫn.', 'Tiêu chảy kèm sốt, máu hoặc mất nước cần được khám, không tự điều trị bằng lá.'],
        henna: ['Cây bụi vùng nóng khô; lá chứa sắc tố lawsone.', 'Thử trên vùng da nhỏ trước khi nhuộm và dùng sản phẩm ghi rõ thành phần.', 'Tránh henna đen không rõ nguồn gốc vì có thể chứa chất gây dị ứng mạnh.'],
        hibiscus: ['Cây bụi hoa lớn; cần phân biệt dâm bụt cảnh với bụp giấm.', 'Không tự nấu hoa cây cảnh để uống; chọn nguyên liệu thực phẩm có nhãn.', 'Có thể gây dị ứng; dữ liệu về liều dùng trong thai kỳ còn hạn chế.'],
        jackfruit: ['Cây gỗ lớn vùng nhiệt đới, quả mọc trực tiếp trên thân và cành lớn.', 'Ăn múi chín hoặc hạt đã nấu chín, khẩu phần vừa phải.', 'Nhựa mít có thể gây kích ứng; người dị ứng latex cần thận trọng.'],
        jasmine: ['Cây bụi hoặc dây leo, hoa thơm mạnh về đêm.', 'Dùng hoa sạch để ướp trà; không sử dụng hoa đã phun thuốc bảo vệ thực vật.', 'Trà hoa chỉ là đồ uống, không thay thuốc an thần hoặc thuốc ngủ.'],
        lantana: ['Cây bụi cảnh mọc nhanh, cụm hoa thường đổi màu khi nở.', 'Không dùng quả, lá hoặc rễ làm thuốc tại nhà.', 'Quả xanh đặc biệt nguy hiểm khi trẻ em hoặc vật nuôi ăn phải.'],
        lemon: ['Cây có gai, quả vàng, vỏ chứa tinh dầu thơm.', 'Pha loãng nước quả và súc miệng bằng nước sau khi uống để bảo vệ men răng.', 'Axit không chữa được trào ngược; tránh bôi nước hoặc tinh dầu lên da trước khi ra nắng.'],
        lemongrass: ['Cây cỏ mọc thành bụi, thường được trồng lấy thân thơm.', 'Dùng thân làm gia vị hoặc trà loãng; không uống tinh dầu nguyên chất.', 'Có thể gây kích ứng da và dạ dày ở người nhạy cảm.'],
        'malabar-spinach': ['Dây leo ưa ẩm, lá dày và có thể có thân tím.', 'Rửa sạch, nấu chín như rau; bảo quản lạnh nếu chưa dùng.', 'Không dùng rau héo, dập hoặc không rõ nguồn nước tưới.'],
        mango: ['Cây ăn quả nhiệt đới, nhiều giống địa phương.', 'Ăn quả chín đã gọt và rửa sạch; điều chỉnh khẩu phần theo chế độ ăn.', 'Nhựa vỏ và lá có thể gây viêm da tiếp xúc ở người nhạy cảm.'],
        marigold: ['Cây hoa ưa nắng, thường trồng làm cảnh hoặc lấy màu.', 'Chỉ dùng nguyên liệu đạt chuẩn thực phẩm; không dùng hoa cảnh đã phun thuốc.', 'Phấn hoa có thể gây dị ứng; không xem là thuốc điều trị bệnh mắt hoặc da.'],
        mint: ['Cây thân vuông, lan nhanh ở nơi ẩm và mát.', 'Lá rửa sạch dùng trong món ăn hoặc trà loãng; tinh dầu phải pha đúng chuẩn.', 'Menthol đậm đặc không an toàn cho trẻ nhỏ và không được uống tùy tiện.'],
        neem: ['Cây gỗ chịu hạn, lá kép có vị đắng.', 'Ưu tiên sản phẩm ngoài da có kiểm soát; không tự uống lá hoặc dầu.', 'Tránh dùng cho trẻ em, thai kỳ và người có bệnh gan nếu chưa được tư vấn.'],
        nelavembu: ['Cây thân thảo ưa ấm, hoa nhỏ có đốm tím.', 'Chỉ dùng chế phẩm định lượng rõ, trong thời gian ngắn theo hướng dẫn.', 'Có thể gây dị ứng, hạ huyết áp hoặc tương tác thuốc; không tự dùng khi sốt kéo dài.'],
        nooni: ['Cây bụi nhiệt đới, quả ghép có mùi mạnh khi chín.', 'Chọn nước quả hoặc chế phẩm có kiểm nghiệm và liều dùng rõ ràng.', 'Người bệnh gan, thận hoặc dùng thuốc dài ngày cần hỏi bác sĩ trước khi dùng.'],
        onion: ['Cây thân hành, củ hình thành dưới đất; có nhiều màu vỏ.', 'Bóc lớp ngoài, rửa sạch và dùng trong bữa ăn; có thể dùng sống hoặc chín tùy món.', 'Có thể gây đầy hơi, kích ứng mắt và dị ứng ở một số người.'],
        papaya: ['Cây thân mềm, lá xẻ lớn, quả mọc quanh phần thân trên.', 'Ăn quả chín; không tự dùng mủ hoặc hạt làm thuốc.', 'Mủ đu đủ có thể gây dị ứng và không phù hợp trong thai kỳ nếu dùng dạng cô đặc.'],
        tomato: ['Cây thân mềm có lông, quả chuyển đỏ khi chín.', 'Rửa sạch, ưu tiên quả chín; chế biến giúp giảm vị chua với người nhạy dạ dày.', 'Lá và phần xanh có alkaloid, không nên dùng làm rau hoặc trà.'],
        tulsi: ['Cây thân vuông, lá thơm, thường có thân và cụm hoa tím.', 'Dùng lá sạch làm rau thơm hoặc trà loãng; không uống tinh dầu.', 'Không tự dùng liều cao khi mang thai hoặc đang dùng thuốc chống đông.']
    };

    Object.entries(extendedDetails).forEach(([id, [habitat, preparation, caution]]) => {
        const herb = window.HerbaPediaHerbs.find((item) => item.id === id);
        if (herb) Object.assign(herb, { habitat, preparation, caution });
    });

    const usageDetails = {
        aloevera: ['Sơ chế: rửa lá, cắt bỏ gai và ngâm/rửa kỹ phần gel để loại nhựa vàng.', 'Cách dùng: lấy một lượng nhỏ gel sạch dùng ngoài da; thử trên vùng da nhỏ trước.', 'Tần suất: chỉ dùng khi cần và ngừng ngay nếu da đỏ, ngứa hoặc rát.'],
        betel: ['Sơ chế: chọn lá tươi, rửa kỹ dưới vòi nước và đun sôi nếu dùng nước rửa ngoài.', 'Cách dùng: dùng lá trong ẩm thực hoặc nước đã nguội để vệ sinh ngoài da theo hướng dẫn.', 'Không dùng: không uống nước lá đậm đặc hoặc thụt rửa khi chưa có chỉ định.'],
        bhrami: ['Chuẩn bị: ưu tiên viên/cao có tiêu chuẩn chất lượng, ghi rõ hàm lượng Bacopa.', 'Cách dùng: dùng đúng liều trên nhãn, thường uống cùng bữa ăn để giảm khó chịu dạ dày.', 'Theo dõi: ngừng dùng và hỏi bác sĩ nếu buồn nôn, đau bụng hoặc đang dùng thuốc an thần.'],
        bringaraja: ['Sơ chế: chỉ dùng dược liệu được định danh, rửa sạch và phơi/sấy đúng quy trình.', 'Cách dùng: dùng trong chế phẩm có liều lượng rõ ràng; không tự giã cây tươi để uống.', 'Lưu ý: không dùng để thay thế xử trí y tế khi chảy máu hoặc bệnh gan.'],
        castor: ['Nguyên liệu: chỉ dùng dầu thầu dầu dược dụng đã tinh chế, tuyệt đối không dùng hạt sống.', 'Cách dùng: nếu sản phẩm được chỉ định, tuân thủ đúng liều và thời gian trên nhãn.', 'Lưu ý: không tự dùng cho trẻ em, người đau bụng chưa rõ nguyên nhân hoặc phụ nữ mang thai.'],
        catharanthus: ['Nguyên liệu: không tự thu hái hoặc bào chế toàn cây tại nhà.', 'Cách dùng: chỉ sử dụng hoạt chất trong thuốc được kê và theo dõi bởi cơ sở y tế.', 'Lưu ý: không dùng trà, nước sắc hoặc bột dừa cạn để điều trị bệnh.'],
        chilly: ['Sơ chế: rửa sạch quả, bỏ cuống; dùng lượng nhỏ trong món ăn tùy khả năng chịu cay.', 'Cách dùng ngoài da: chỉ dùng kem capsaicin thương mại, rửa tay sau khi bôi và tránh mắt.', 'Lưu ý: không bôi ớt tươi lên da, vết thương hoặc vùng niêm mạc.'],
        'citron-lime': ['Sơ chế: rửa quả, vắt lấy nước; nếu dùng vỏ phải chà sạch và chọn quả không phun hóa chất.', 'Cách dùng: pha loãng với nước và dùng như gia vị/đồ uống, không uống nước cốt quá đậm đặc.', 'Bảo vệ răng: súc miệng bằng nước sau khi uống và không chải răng ngay lập tức.'],
        coffee: ['Chuẩn bị: dùng hạt rang và pha bằng phương pháp thông thường, hạn chế đường và kem.', 'Cách dùng: uống vào buổi sáng hoặc đầu giờ chiều, tránh dùng sát giờ ngủ.', 'Theo dõi: giảm lượng nếu hồi hộp, run tay, bồn chồn hoặc mất ngủ.'],
        coriender: ['Sơ chế: nhặt bỏ lá hỏng, rửa nhiều lần và để ráo trước khi ăn.', 'Cách dùng: dùng lá làm rau gia vị hoặc thêm vào món ăn sau khi nấu.', 'Lưu ý: người từng dị ứng rau mùi nên thử lượng rất nhỏ hoặc tránh dùng.'],
        curry: ['Sơ chế: tách lá khỏi cành, rửa sạch và dùng tươi hoặc nấu cùng món ăn.', 'Cách dùng: dùng như gia vị trong khẩu phần thông thường, không tự cô đặc thành thuốc.', 'Lưu ý: không tự dùng thay thuốc kiểm soát đường huyết.'],
        doddpathre: ['Sơ chế: chọn lá không sâu bệnh, rửa sạch và vò nhẹ để tạo mùi thơm.', 'Cách dùng: dùng như rau thơm hoặc nấu chín trong món ăn; có thể pha trà loãng từ lá sạch.', 'Lưu ý: không nhỏ nước lá vào tai/mũi và không dùng tinh dầu nguyên chất.'],
        drumstick: ['Sơ chế: rửa lá/quả non, loại bỏ phần già và nấu chín trước khi ăn.', 'Cách dùng: dùng như rau trong canh hoặc món xào, bắt đầu với khẩu phần vừa phải.', 'Lưu ý: không tự nấu rễ, vỏ hoặc chế phẩm cô đặc.'],
        eucalyptus: ['Chuẩn bị: chỉ dùng sản phẩm xoa/bôi hoặc hít có nồng độ và hướng dẫn rõ ràng.', 'Cách dùng: dùng ngoài da theo nhãn, tránh bôi lên mặt, vết thương và vùng quanh mũi trẻ nhỏ.', 'Tuyệt đối không uống tinh dầu và không tự nhỏ tinh dầu vào mũi.'],
        ginger: ['Sơ chế: rửa sạch, cạo mỏng vỏ nếu cần và thái lát hoặc đập dập.', 'Cách dùng: thêm vào món ăn hoặc pha vài lát với nước ấm; dùng lượng vừa phải.', 'Lưu ý: hỏi bác sĩ nếu đang dùng thuốc chống đông, có sỏi mật hoặc chuẩn bị phẫu thuật.'],
        guava: ['Sơ chế: quả rửa sạch, ăn chín; lá phải được định danh và làm sạch trước khi chế biến.', 'Cách dùng: ưu tiên ăn quả như thực phẩm; không tự dùng nước lá kéo dài để trị tiêu chảy.', 'Lưu ý: tiêu chảy có sốt, máu hoặc mất nước cần được khám sớm.'],
        henna: ['Chuẩn bị: chọn bột lá có bảng thành phần, pha theo hướng dẫn của nhà sản xuất.', 'Cách dùng: thử trên vùng da nhỏ 24 giờ trước khi nhuộm và tránh vùng da đang tổn thương.', 'Lưu ý: không dùng sản phẩm “henna đen” không rõ thành phần.'],
        hibiscus: ['Nguyên liệu: chỉ dùng hoa được bán làm thực phẩm và xác định đúng loài, không dùng hoa cảnh phun thuốc.', 'Cách dùng: có thể ướp trà hoặc dùng lượng nhỏ theo hướng dẫn của sản phẩm.', 'Lưu ý: không tự dùng nước sắc hoa để điều trị huyết áp hoặc bệnh mạn tính.'],
        jackfruit: ['Sơ chế: dùng dầu ăn bôi tay/dao khi tách múi, bỏ hạt sống và phần xơ cứng.', 'Cách dùng: ăn múi chín hoặc hạt đã luộc/nấu chín, chia khẩu phần nhỏ.', 'Lưu ý: người kiểm soát đường huyết hoặc dễ đầy bụng không nên ăn quá nhiều.'],
        jasmine: ['Sơ chế: chọn hoa sạch, không phun thuốc; rửa nhẹ và để ráo nếu cần.', 'Cách dùng: dùng một lượng nhỏ để ướp trà, không ngâm quá đặc hoặc uống thay nước hằng ngày.', 'Lưu ý: không dùng trà hoa nhài thay thuốc ngủ hoặc thuốc an thần.'],
        lantana: ['Cách dùng: chỉ nên xem là cây cảnh; không sử dụng lá, hoa, quả hoặc rễ làm thuốc.', 'Nếu nuốt phải: không tự gây nôn, liên hệ cơ sở y tế và mang theo mẫu cây nếu có.', 'Bảo quản: trồng xa trẻ nhỏ và vật nuôi, đặc biệt khi cây có quả xanh.'],
        lemon: ['Sơ chế: rửa quả, vắt nước và pha loãng; rửa sạch vỏ trước khi bào.', 'Cách dùng: dùng làm gia vị hoặc đồ uống sau bữa ăn, tránh uống nước cốt khi đói nếu dễ kích ứng.', 'Lưu ý: không bôi nước/vỏ chanh lên da trước khi tiếp xúc ánh nắng.'],
        lemongrass: ['Sơ chế: bóc bẹ già, đập dập phần thân non và rửa sạch.', 'Cách dùng: nấu cùng món ăn hoặc pha trà loãng; lọc bỏ bã trước khi uống.', 'Lưu ý: không uống tinh dầu sả nguyên chất và không dùng quá đậm đặc.'],
        'malabar-spinach': ['Sơ chế: nhặt ngọn non, rửa nhiều lần và để ráo.', 'Cách dùng: nấu canh hoặc xào chín như rau; dùng trong bữa ăn cân đối.', 'Lưu ý: không dùng rau úa, nhớt hoặc không rõ nguồn nước tưới.'],
        mango: ['Sơ chế: rửa quả, gọt vỏ và bỏ hạt; quả xanh nên dùng lượng vừa phải.', 'Cách dùng: ăn quả chín như thực phẩm, không xem nước lá/vỏ là thuốc tự điều trị.', 'Lưu ý: người dị ứng nhựa cây hoặc kiểm soát đường huyết cần thận trọng khẩu phần.'],
        marigold: ['Nguyên liệu: chỉ dùng cánh hoa đạt chuẩn thực phẩm, không dùng hoa trồng cảnh đã phun thuốc.', 'Cách dùng: dùng một lượng nhỏ để tạo màu hoặc trang trí món ăn theo hướng dẫn sản phẩm.', 'Lưu ý: ngừng sử dụng khi ngứa, nổi mẩn hoặc khó thở.'],
        mint: ['Sơ chế: nhặt lá, rửa sạch và để ráo; dùng lá tươi hoặc phơi trong bóng râm.', 'Cách dùng: thêm vào món ăn hoặc pha trà loãng; tinh dầu phải được pha theo nhãn.', 'Lưu ý: không cho tinh dầu bạc hà nguyên chất vào miệng hoặc dùng cho trẻ nhỏ.'],
        neem: ['Nguyên liệu: chỉ dùng chế phẩm ngoài da có công bố thành phần và hướng dẫn.', 'Cách dùng: thử trên vùng da nhỏ trước, bôi lớp mỏng và tránh vùng mắt/miệng.', 'Lưu ý: không tự uống lá/dầu neem, đặc biệt ở trẻ em và phụ nữ mang thai.'],
        nelavembu: ['Nguyên liệu: chọn chế phẩm có định lượng andrographolide và nguồn gốc rõ ràng.', 'Cách dùng: dùng đúng liều trên nhãn trong thời gian ngắn, uống với nước.', 'Lưu ý: dừng khi nổi mẩn, khó thở hoặc đau bụng; sốt kéo dài cần đi khám.'],
        nooni: ['Nguyên liệu: dùng quả/chế phẩm có kiểm nghiệm, không tự lên men hoặc cô đặc tại nhà.', 'Cách dùng: bắt đầu với lượng nhỏ theo nhãn và không phối hợp tùy tiện với thuốc khác.', 'Lưu ý: người bệnh gan, thận hoặc dùng thuốc dài ngày cần hỏi bác sĩ.'],
        onion: ['Sơ chế: bóc lớp vỏ ngoài, rửa sạch và cắt ngay trước khi nấu.', 'Cách dùng: dùng sống hoặc nấu chín trong bữa ăn; có thể kết hợp với nhiều loại rau khác.', 'Lưu ý: người dị ứng hoặc dễ trào ngược nên giảm lượng khi thấy khó chịu.'],
        papaya: ['Sơ chế: chọn quả chín, rửa sạch, gọt vỏ và bỏ hạt trước khi ăn.', 'Cách dùng: ăn trực tiếp hoặc dùng trong món tráng miệng; không tự dùng mủ/hạt.', 'Lưu ý: tránh chế phẩm mủ đu đủ trong thai kỳ và khi có tiền sử dị ứng latex.'],
        tomato: ['Sơ chế: rửa sạch, bỏ phần dập; ưu tiên quả chín đỏ thay vì quả xanh.', 'Cách dùng: ăn sống, nấu canh hoặc chế biến cùng dầu ăn trong khẩu phần phù hợp.', 'Lưu ý: không dùng lá, thân hoặc quả xanh làm trà/rau vì có thể gây khó chịu.'],
        tulsi: ['Sơ chế: chọn lá sạch, rửa nhẹ và dùng tươi hoặc phơi trong bóng râm.', 'Cách dùng: dùng như rau thơm hoặc pha trà loãng; không uống tinh dầu.', 'Lưu ý: hỏi bác sĩ nếu mang thai, chuẩn bị phẫu thuật hoặc dùng thuốc chống đông.']
    };

    Object.entries(usageDetails).forEach(([id, steps]) => {
        const herb = window.HerbaPediaHerbs.find((item) => item.id === id);
        if (herb) herb.usageDetails = steps;
    });

    const usageCorrections = {
        aloevera: ['Dạng dùng: gel trong đã loại bỏ nhựa vàng, chủ yếu dùng ngoài da.', 'Cách dùng: rửa sạch lá, bỏ gai, tách gel và rửa nhiều lần trước khi bôi một lớp mỏng; thử trên vùng da nhỏ trước.', 'Liều: không tự uống gel/nhựa nha đam; dùng sản phẩm đường uống chỉ theo nhãn và tư vấn chuyên môn.'],
        betel: ['Dạng dùng: lá tươi trong ẩm thực hoặc nước lá dùng ngoài theo hướng dẫn.', 'Cách dùng: rửa kỹ; nếu dùng ngoài, đun sôi lá với nước, để nguội rồi dùng bên ngoài da, không dùng cho vết thương sâu.', 'Liều: không có liều uống tự dùng an toàn được áp dụng chung; không thụt rửa âm đạo.'],
        bhrami: ['Dạng dùng: dược liệu khô/cao/viên chuẩn hóa, không dùng cây thu hái không định danh.', 'Cách dùng: dùng đúng hàm lượng và hướng dẫn của chế phẩm; không tự sắc cây để điều trị suy giảm trí nhớ.', 'Liều: chưa ghi liều chung vì phụ thuộc cao chiết và hàm lượng hoạt chất; hỏi thầy thuốc khi dùng thuốc an thần.'],
        bringaraja: ['Dạng dùng: dược liệu khô hoặc chế phẩm đã định danh; không dùng cây tươi không rõ loài.', 'Cách dùng: chỉ dùng trong bài thuốc do người có chuyên môn kê; không đắp lên vết thương để cầm máu.', 'Liều: không tự dùng đường uống; chảy máu nhiều phải ép cầm máu và đi cấp cứu.'],
        castor: ['Dạng dùng: dầu thầu dầu dược dụng đã tinh chế; hạt sống không phải nguyên liệu tự dùng.', 'Cách dùng: chỉ dùng khi sản phẩm có hướng dẫn rõ và không dùng kéo dài; không tự ép dầu từ hạt.', 'Liều: không tự dùng cho trẻ em, thai kỳ hoặc đau bụng chưa rõ nguyên nhân; hạt chứa ricin gây độc.'],
        catharanthus: ['Dạng dùng: hoạt chất trong thuốc chuyên khoa, không dùng lá/hoa tự sắc.', 'Cách dùng: chỉ sử dụng thuốc được kê và theo dõi bởi cơ sở y tế; không dùng cây cảnh thay thuốc.', 'Liều: không có liều tự dùng; cây có alkaloid độc và có thể gây tác dụng nghiêm trọng.'],
        chilly: ['Dạng dùng: quả làm gia vị; capsaicin chỉ dùng dưới dạng kem/miếng dán thương mại.', 'Cách dùng: rửa sạch, dùng lượng vừa trong món ăn; chế phẩm ngoài da dùng đúng vùng và thời gian trên nhãn.', 'Liều: không bôi quả tươi hoặc bột ớt lên da, mắt, niêm mạc hay vết thương.'],
        'citron-lime': ['Dạng dùng: quả làm gia vị hoặc nước uống pha loãng; không xem là thuốc giải độc.', 'Cách dùng: rửa quả, vắt nước, pha với nước; dùng vỏ chỉ khi quả an toàn thực phẩm và đã rửa sạch.', 'Liều: không uống nước cốt đậm đặc khi đói; tránh nắng nếu da tiếp xúc tinh dầu vỏ.'],
        coffee: ['Dạng dùng: hạt rang pha thành đồ uống, không dùng lá/quả xanh làm thuốc.', 'Cách dùng: uống lượng vừa phải, ưu tiên ít đường và tránh buổi tối; tính cả caffeine từ các đồ uống khác.', 'Liều: không có một mức phù hợp cho mọi người; giảm hoặc ngừng khi hồi hộp, run, mất ngủ.'],
        coriender: ['Dạng dùng: lá/hạt làm gia vị và thực phẩm.', 'Cách dùng: nhặt, rửa kỹ, dùng tươi hoặc thêm vào món ăn sau khi nấu; hạt dùng như gia vị đã làm sạch.', 'Liều: dùng như rau gia vị, không tự sắc đặc để điều trị bệnh.'],
        curry: ['Dạng dùng: lá làm gia vị; không đồng nhất với thuốc điều trị đái tháo đường.', 'Cách dùng: rửa sạch, dùng trong món ăn với khẩu phần thông thường.', 'Liều: không tự dùng lá cô đặc để hạ đường huyết hoặc thay thuốc kê đơn.'],
        doddpathre: ['Dạng dùng: lá làm rau thơm/thực phẩm; một số sản phẩm ho có thể chứa cao lá theo công thức riêng.', 'Cách dùng: rửa sạch, dùng trong món ăn hoặc chế biến theo nhãn sản phẩm; không nhỏ nước lá vào tai/mũi.', 'Liều: không tự dùng tinh dầu hoặc nước lá đậm đặc cho trẻ nhỏ.'],
        drumstick: ['Dạng dùng: lá và quả non làm thực phẩm; rễ/vỏ không dùng tùy tiện.', 'Cách dùng: rửa sạch, nấu chín như rau trong bữa ăn; dùng khẩu phần cân đối.', 'Liều: không tự dùng bột/cao cô đặc, đặc biệt từ rễ hoặc vỏ; thai kỳ cần hỏi chuyên môn.'],
        eucalyptus: ['Dạng dùng: lá khô hoặc tinh dầu trong sản phẩm xông/xoa đã chuẩn hóa; không uống tinh dầu.', 'Cách dùng: dùng đúng hướng dẫn của sản phẩm, thông thoáng phòng và tránh mắt, miệng, trẻ nhỏ.', 'Liều: không tự nhỏ/uống tinh dầu; ngộ độc có thể xảy ra với lượng nhỏ.'],
        ginger: ['Dạng dùng: thân rễ tươi/khô làm gia vị, trà hoặc vị thuốc trong bài thuốc.', 'Cách dùng: rửa sạch, thái lát hoặc đập dập; dùng trong món ăn/nước ấm. Dạng thuốc sắc phải theo bài thuốc.', 'Liều: không áp dụng một liều chung; hỏi thầy thuốc nếu dùng thuốc chống đông, có sỏi mật hoặc sắp phẫu thuật.'],
        guava: ['Dạng dùng: quả là thực phẩm; lá chỉ dùng trong chế phẩm/bài thuốc có chỉ định.', 'Cách dùng: ăn quả chín đã rửa sạch; không tự dùng nước lá kéo dài để trị tiêu chảy.', 'Liều: tiêu chảy có máu, sốt, đau nhiều hoặc mất nước cần khám, không trì hoãn bằng thuốc dân gian.'],
        henna: ['Dạng dùng: bột lá dùng ngoài để nhuộm; không uống.', 'Cách dùng: dùng sản phẩm có thành phần rõ, thử trên vùng da nhỏ trước và làm theo hướng dẫn thời gian nhuộm.', 'Liều: tránh henna đen không rõ nguồn gốc vì có thể chứa PPD gây bỏng và dị ứng nặng.'],
        hibiscus: ['Dạng dùng: cần phân biệt dâm bụt cảnh với bụp giấm; hoa cảnh không mặc nhiên dùng làm trà.', 'Cách dùng: chỉ dùng nguyên liệu được bán cho mục đích thực phẩm, pha theo nhãn sản phẩm.', 'Liều: không tự dùng để điều trị huyết áp hoặc bệnh mạn tính; hỏi bác sĩ nếu đang dùng thuốc.'],
        jackfruit: ['Dạng dùng: múi chín và hạt đã nấu chín là thực phẩm.', 'Cách dùng: tách múi, bỏ xơ và hạt sống; hạt phải luộc/nấu chín, ăn khẩu phần vừa.', 'Liều: không có liều dược liệu; người đái tháo đường hoặc dễ đầy bụng cần giới hạn khẩu phần.'],
        jasmine: ['Dạng dùng: hoa sạch để ướp trà/hương liệu; không dùng hoa phun thuốc.', 'Cách dùng: dùng lượng nhỏ theo hướng dẫn trà đóng gói, không ngâm quá đặc hoặc thay nước hằng ngày.', 'Liều: không dùng trà hoa nhài thay thuốc ngủ, thuốc an thần hoặc thuốc điều trị.'],
        lantana: ['Dạng dùng: cây cảnh, không phải nguyên liệu tự dùng làm thuốc.', 'Cách dùng: không sắc uống, không đắp lá và không ăn quả; trồng xa trẻ nhỏ và vật nuôi.', 'Liều: không có liều tự dùng an toàn; nếu nuốt phải cần liên hệ cơ sở y tế, không tự gây nôn.'],
        lemon: ['Dạng dùng: quả làm gia vị/nước uống; vỏ chỉ dùng khi đạt chuẩn thực phẩm.', 'Cách dùng: rửa sạch, pha nước cốt với nước; dùng sau ăn nếu dễ kích ứng dạ dày và súc miệng sau uống.', 'Liều: không uống nước cốt thay thuốc dạ dày; tránh bôi nước/vỏ lên da trước khi ra nắng.'],
        lemongrass: ['Dạng dùng: thân giả làm gia vị/trà; tinh dầu chỉ dùng ngoài theo sản phẩm.', 'Cách dùng: bóc bẹ già, rửa, đập dập và nấu trong món ăn hoặc pha trà loãng; lọc bã trước khi uống.', 'Liều: không uống tinh dầu sả và không dùng nước trà quá đậm đặc kéo dài.'],
        'malabar-spinach': ['Dạng dùng: lá và ngọn non làm rau.', 'Cách dùng: nhặt, rửa kỹ, nấu chín như canh/xào; bảo quản lạnh nếu chưa dùng.', 'Liều: dùng như thực phẩm, không tự cô đặc thành thuốc; bỏ rau nhớt, úa hoặc không rõ nguồn nước.'],
        mango: ['Dạng dùng: quả chín là thực phẩm; lá, vỏ và hạt không tự dùng làm thuốc.', 'Cách dùng: rửa, gọt vỏ, bỏ hạt và ăn quả chín với khẩu phần phù hợp.', 'Liều: không có liều dược liệu cho quả ăn; người dị ứng nhựa cây hoặc kiểm soát đường huyết cần thận trọng.'],
        marigold: ['Dạng dùng: hoa đạt chuẩn thực phẩm để trang trí/tạo màu; không dùng hoa cảnh phun thuốc.', 'Cách dùng: chỉ dùng lượng nhỏ theo hướng dẫn nguyên liệu thực phẩm, không tự sắc uống.', 'Liều: không dùng để điều trị bệnh mắt/da; ngừng dùng khi có dấu hiệu dị ứng.'],
        mint: ['Dạng dùng: lá làm rau thơm/trà; tinh dầu là chế phẩm riêng.', 'Cách dùng: rửa lá, dùng tươi hoặc pha trà loãng; tinh dầu phải pha và dùng đúng nhãn.', 'Liều: không uống tinh dầu bạc hà và không dùng tinh dầu nguyên chất cho trẻ nhỏ.'],
        neem: ['Dạng dùng: một số chế phẩm ngoài da; lá/dầu nguyên chất không phải đồ uống an toàn.', 'Cách dùng: chỉ dùng sản phẩm bôi có thành phần, nồng độ và hướng dẫn rõ; thử vùng da nhỏ trước.', 'Liều: không tự uống lá/dầu neem, nhất là trẻ em, thai kỳ hoặc người bệnh gan.'],
        nelavembu: ['Dạng dùng: phần trên mặt đất khô hoặc chế phẩm chuẩn hóa trong bài thuốc.', 'Cách dùng: chỉ dùng sản phẩm ghi rõ hàm lượng và thời gian dùng; không tự phối hợp nhiều thuốc hạ sốt.', 'Liều: không đưa liều chung khi chưa biết dạng dược liệu; có thể tương tác thuốc và gây dị ứng.'],
        nooni: ['Dạng dùng: quả/chế phẩm có kiểm nghiệm; không tự lên men hoặc cô đặc tại nhà.', 'Cách dùng: dùng theo nhãn của sản phẩm, không phối hợp tùy tiện với thuốc đang dùng.', 'Liều: không có liều tự dùng chung; người bệnh gan, thận hoặc dùng thuốc dài ngày cần hỏi bác sĩ.'],
        onion: ['Dạng dùng: củ làm thực phẩm, dùng sống hoặc chín.', 'Cách dùng: bóc lớp ngoài, rửa sạch, cắt trước khi chế biến; điều chỉnh theo khả năng tiêu hóa.', 'Liều: dùng như rau gia vị, không tự sắc vỏ/củ để thay thuốc điều trị.'],
        papaya: ['Dạng dùng: quả chín làm thực phẩm; mủ, lá và hạt không tự dùng.', 'Cách dùng: rửa quả, gọt vỏ, bỏ hạt và ăn chín; không dùng quả xanh/mủ dạng cô đặc trong thai kỳ.', 'Liều: không có liều thuốc tự dùng; người dị ứng latex cần thận trọng.'],
        tomato: ['Dạng dùng: quả chín làm thực phẩm; lá, thân và quả xanh không dùng làm trà.', 'Cách dùng: rửa sạch, ăn sống hoặc nấu chín; người trào ngược nên điều chỉnh lượng và cách chế biến.', 'Liều: dùng như rau quả, không tự dùng bộ phận xanh vì có thể chứa alkaloid gây độc.'],
        tulsi: ['Dạng dùng: lá/ngọn làm rau thơm hoặc trà; tinh dầu không dùng đường uống tùy tiện.', 'Cách dùng: rửa sạch, dùng tươi hoặc pha trà loãng từ nguyên liệu khô đạt chuẩn.', 'Liều: không có liều tự dùng chung; hỏi bác sĩ khi mang thai, sắp phẫu thuật hoặc dùng thuốc chống đông.']
    };

    Object.entries(usageCorrections).forEach(([id, steps]) => {
        const herb = window.HerbaPediaHerbs.find((item) => item.id === id);
        if (herb) herb.usageDetails = steps;
    });
})();


// === DỮ LIỆU DƯỢC LIỆU 16 LOÀI CHUẨN XÁC THEO NGHIÊN CỨU DƯỢC HỌC & HÌNH THÁI LÁ ===
const OFFICIAL_16_HERBS_DATA = {
    "tulsi": {
        "name": "Hương nhu tía",
        "scientific": "Ocimum tenuiflorum",
        "datasetName": "Tulsi",
        "usage": "Lá chứa tinh dầu, eugenol và các hợp chất phenolic; được nghiên cứu về hoạt tính chống oxy hóa, kháng khuẩn và chống viêm.",
        "identification": "Lá đơn mọc đối, hình bầu dục hoặc thuôn, mép có răng cưa, đầu lá nhọn, gân hình lông chim. Mặt lá xanh hoặc tím xanh, có lông mịn; vò lá có mùi thơm đặc trưng.",
        "habitat": "Cây thân thảo, ưa khí hậu nóng ẩm, nhiều ánh sáng; thích hợp với đất tơi xốp, thoát nước tốt; có thể trồng phổ biến tại Việt Nam.",
        "preparation": "Lá tươi hoặc khô được sử dụng trong dân gian dưới dạng trà, nước sắc; lá cũng được dùng làm gia vị; không tự ý sử dụng tinh dầu đậm đặc.",
        "remedies": [
            "Lá được dùng theo kinh nghiệm dân gian để hỗ trợ giảm ho, cảm lạnh.",
            "Tinh dầu được nghiên cứu về kháng khuẩn và chống viêm trong phòng thí nghiệm."
        ],
        "caution": "Chưa đủ bằng chứng xác nhận hiệu quả điều trị trên người; không tự ý sử dụng tinh dầu đậm đặc.",
        "safety": "Cần thận trọng với tinh dầu đậm đặc; phụ nữ có thai nên tham khảo ý kiến chuyên gia."
    },
    "tomato": {
        "name": "Cà chua",
        "scientific": "Solanum lycopersicum",
        "datasetName": "Tomato",
        "usage": "Lá chứa các hợp chất phenolic và flavonoid; có tiềm năng chống oxy hóa trong nghiên cứu thực nghiệm; lá không phải bộ phận dùng làm thực phẩm thông thường.",
        "identification": "Lá kép lông chim, mọc so le, chia thành nhiều lá chét không đều, mép lá chét có răng cưa hoặc thùy, gân hình lông chim. Mặt lá xanh, có lông mềm; vò lá có mùi đặc trưng của cây cà chua.",
        "habitat": "Cây thân thảo, thích hợp khí hậu ấm, đủ ánh sáng; phát triển tốt trên đất tơi xốp, giàu dinh dưỡng và thoát nước; được trồng rộng rãi tại Việt Nam.",
        "preparation": "Lá chủ yếu được nghiên cứu trong lĩnh vực thực vật học và hóa thực vật; không khuyến khích sử dụng làm trà hoặc thực phẩm do có thể chứa glycoalkaloid.",
        "remedies": [
            "Chưa có bài thuốc dân gian từ lá cà chua được xác nhận đáng tin cậy.",
            "Được nghiên cứu thực nghiệm về các hợp chất phenolic và flavonoid có hoạt tính chống oxy hóa."
        ],
        "caution": "Lá có thể chứa tomatine và các glycoalkaloid độc hại; tuyệt đối không tự ý ăn hoặc uống nước sắc lá.",
        "safety": "Không dùng lá cà chua làm trà hay thực phẩm vì nguy cơ ngộ độc glycoalkaloid."
    },
    "tea": {
        "name": "Chè (Trà)",
        "scientific": "Camellia sinensis",
        "datasetName": "Tea",
        "usage": "Lá chứa catechin, EGCG, caffeine và L-theanine; có hoạt tính chống oxy hóa; được sử dụng phổ biến để sản xuất trà xanh và trà đen.",
        "identification": "Lá đơn mọc so le, hình bầu dục hoặc thuôn dài; đầu lá nhọn, mép có răng cưa nhỏ; gân giữa nổi rõ, gân phụ dạng lông chim; mặt trên xanh đậm bóng, mặt dưới nhạt hơn; lá non có lông mịn.",
        "habitat": "Cây bụi hoặc cây gỗ nhỏ, ưa khí hậu mát ẩm, lượng mưa khá; thích hợp với đất chua, giàu hữu cơ và thoát nước; được trồng nhiều ở Thái Nguyên, Lâm Đồng và các vùng núi Việt Nam.",
        "preparation": "Lá non được hái, làm héo, diệt men, vò và sấy tùy loại trà; sử dụng phổ biến dưới dạng trà xanh hoặc trà đen; chú ý hàm lượng caffeine.",
        "remedies": [
            "Trà lá được sử dụng làm đồ uống truyền thống và thanh nhiệt.",
            "Catechin (EGCG) được nghiên cứu rộng rãi về khả năng chống oxy hóa và hỗ trợ chuyển hóa."
        ],
        "caution": "Không nên dùng quá nhiều caffeine, đặc biệt vào buổi tối hoặc người nhạy cảm với caffeine.",
        "safety": "Hạn chế uống trà quá đặc khi bụng đói hoặc người có tiền sử loét dạ dày."
    },
    "papaya": {
        "name": "Đu đủ",
        "scientific": "Carica papaya",
        "datasetName": "Papaya",
        "usage": "Lá chứa alkaloid, flavonoid, polyphenol và enzyme papain; được nghiên cứu về hoạt tính chống oxy hóa, chống viêm và một số ứng dụng hỗ trợ điều trị sốt xuất huyết.",
        "identification": "Lá rất lớn, mọc so le tập trung ở ngọn thân; phiến lá hình chân vịt, chia sâu thành 7–11 thùy; gân tỏa hình chân vịt, mép thùy có thể khía; mặt lá xanh, nhẵn; cuống dài và rỗng.",
        "habitat": "Cây thân thảo dạng thân gỗ mềm, ưa khí hậu nhiệt đới nóng ẩm; cần ánh sáng và đất tơi xốp, thoát nước tốt; sinh trưởng tốt tại nhiều vùng ở Việt Nam.",
        "preparation": "Lá được sử dụng trong một số món ăn và kinh nghiệm dân gian; có nghiên cứu về chiết xuất lá dưới dạng chế phẩm; không tự ý uống nước ép hoặc nước sắc để điều trị bệnh.",
        "remedies": [
            "Lá được nghiên cứu về khả năng hỗ trợ tăng tiểu cầu ở bệnh nhân sốt xuất huyết.",
            "Chiết xuất lá được khảo sát về tác dụng chống viêm và chống oxy hóa thực nghiệm."
        ],
        "caution": "Bằng chứng lâm sàng còn hạn chế; không thay thế phác đồ điều trị và cần thận trọng với nguy cơ dị ứng.",
        "safety": "Phụ nữ mang thai không tự ý dùng nước lá đu đủ đậm đặc."
    },
    "orange": {
        "name": "Cam",
        "scientific": "Citrus sinensis",
        "datasetName": "Orange",
        "usage": "Lá chứa tinh dầu và các hợp chất flavonoid như hesperidin; được nghiên cứu về hoạt tính chống oxy hóa và kháng khuẩn; lá có giá trị trong nghiên cứu tinh dầu thực vật.",
        "identification": "Lá đơn, mọc so le, hình bầu dục hoặc thuôn; đầu lá hơi nhọn, mép nguyên hoặc có răng cưa nhỏ; gân hình lông chim; mặt trên xanh đậm, bóng, mặt dưới nhạt hơn; cuống lá thường có cánh hẹp; vò lá có mùi tinh dầu cam.",
        "habitat": "Cây thân gỗ thường xanh, ưa khí hậu nhiệt đới và cận nhiệt đới; thích hợp với đất thịt hoặc đất cát pha thoát nước tốt; được trồng phổ biến tại Việt Nam.",
        "preparation": "Lá tươi có thể được sử dụng tạo hương trong một số kinh nghiệm dân gian; tinh dầu lá được nghiên cứu trong phòng thí nghiệm; không uống tinh dầu nguyên chất.",
        "remedies": [
            "Lá cam được sử dụng trong một số phương pháp tạo hương truyền thống và nồi nước xông.",
            "Tinh dầu lá được nghiên cứu về hoạt tính kháng khuẩn trong phòng thí nghiệm."
        ],
        "caution": "Chưa có đủ bằng chứng lâm sàng xác nhận bài thuốc điều trị từ lá cam; không uống tinh dầu nguyên chất.",
        "safety": "Tinh dầu nguyên chất cần pha loãng khi tiếp xúc ngoài da."
    },
    "neem": {
        "name": "Neem (Sầu đâu)",
        "scientific": "Azadirachta indica",
        "datasetName": "Neem",
        "usage": "Lá chứa azadirachtin, nimbolide, nimbin và các hợp chất flavonoid; được nghiên cứu về hoạt tính kháng khuẩn, chống viêm và khả năng xua đuổi côn trùng.",
        "identification": "Lá kép lông chim, mọc so le; gồm nhiều lá chét hình mũi mác, mép có răng cưa; gân phụ rõ, chạy từ gân giữa ra mép; mặt trên xanh đậm, mặt dưới xanh nhạt; lá chét có gốc thường không đối xứng.",
        "habitat": "Cây thân gỗ nhiệt đới, chịu hạn tốt, ưa ánh sáng; thích hợp với đất cát pha và đất thoát nước; có thể sinh trưởng tại các vùng nóng ở Việt Nam.",
        "preparation": "Lá được sử dụng trong một số kinh nghiệm dân gian và chế phẩm chăm sóc ngoài da; có thể được phơi khô hoặc chiết xuất; không tự ý uống chế phẩm neem.",
        "remedies": [
            "Lá neem được nghiên cứu về kháng khuẩn và chống viêm trong phòng thí nghiệm.",
            "Một số ứng dụng dân gian liên quan đến nước tắm hoặc đắp ngoài trong chăm sóc da."
        ],
        "caution": "Dữ liệu an toàn và hiệu quả trên người còn hạn chế; không tự ý uống chế phẩm lá hay dầu neem.",
        "safety": "Tránh dùng đường uống cho trẻ nhỏ và phụ nữ có thai."
    },
    "lemon": {
        "name": "Chanh vàng",
        "scientific": "Citrus limon",
        "datasetName": "Lemon",
        "usage": "Lá chứa tinh dầu với các hợp chất thơm như limonene, citral tùy bộ phận và mẫu nghiên cứu; có các flavonoid; được nghiên cứu về khả năng chống oxy hóa và kháng khuẩn.",
        "identification": "Lá đơn mọc so le, hình bầu dục hoặc thuôn dài; đầu lá nhọn, mép có răng cưa nhỏ; gân hình lông chim; mặt trên xanh đậm bóng, mặt dưới xanh nhạt; cuống lá thường ít cánh hoặc không có cánh rõ; vò lá có mùi chanh đặc trưng.",
        "habitat": "Cây thân gỗ nhỏ, ưa khí hậu ấm và nhiều ánh sáng; thích hợp với đất tơi xốp, giàu hữu cơ, thoát nước tốt; được trồng tại nhiều vùng ở Việt Nam.",
        "preparation": "Lá tươi có thể được dùng tạo hương trong một số món ăn và kinh nghiệm dân gian; lá khô có thể dùng pha trà theo tập quán; không uống tinh dầu nguyên chất.",
        "remedies": [
            "Lá chanh được sử dụng trong một số kinh nghiệm dân gian để tạo hương và nồi xông hỗ trợ cảm lạnh.",
            "Tinh dầu lá được nghiên cứu về hoạt tính kháng khuẩn."
        ],
        "caution": "Chưa đủ bằng chứng xác nhận hiệu quả điều trị trên người; không uống tinh dầu nguyên chất.",
        "safety": "Dùng lá tươi tạo hương an toàn; tránh thoa tinh dầu trực tiếp lên da trước khi ra nắng."
    },
    "jackfruit": {
        "name": "Mít",
        "scientific": "Artocarpus heterophyllus",
        "datasetName": "Jackfruit",
        "usage": "Lá chứa các hợp chất phenolic và flavonoid; một số chiết xuất được nghiên cứu về hoạt tính chống oxy hóa và kháng khuẩn; tiềm năng dược liệu vẫn đang được khảo sát.",
        "identification": "Lá đơn mọc so le, hình bầu dục hoặc hình trứng ngược; phiến lá dày, dai; mép nguyên, đầu lá tù hoặc nhọn; gân hình lông chim, gân giữa nổi rõ ở mặt dưới; mặt trên xanh đậm bóng, mặt dưới xanh nhạt; cuống hoặc cành có nhựa trắng khi bị tổn thương.",
        "habitat": "Cây thân gỗ thường xanh, ưa khí hậu nhiệt đới nóng ẩm; thích hợp với đất sâu, giàu dinh dưỡng và thoát nước; phát triển phổ biến tại nhiều vùng ở Việt Nam.",
        "preparation": "Lá được sử dụng trong một số kinh nghiệm dân gian; có thể được làm sạch, phơi khô để phục vụ nghiên cứu dược liệu; không tự ý sử dụng dịch chiết làm thuốc.",
        "remedies": [
            "Lá mít được nghiên cứu về hoạt tính chống oxy hóa và kháng khuẩn trong phòng thí nghiệm.",
            "Được dùng theo một số kinh nghiệm dân gian (như nước sắc lá mít)."
        ],
        "caution": "Chưa có đủ bằng chứng lâm sàng xác nhận bài thuốc điều trị từ lá; không tự ý sử dụng dịch chiết làm thuốc.",
        "safety": "Lá mít làm sạch an toàn khi dùng dân gian thông thường."
    },
    "hibiscus": {
        "name": "Râm bụt (Dâm bụt)",
        "scientific": "Hibiscus rosa-sinensis",
        "datasetName": "Hibiscus",
        "usage": "Lá chứa flavonoid, tannin, polyphenol và các hợp chất nhầy; được nghiên cứu về hoạt tính chống oxy hóa, chống viêm và kháng khuẩn.",
        "identification": "Lá đơn mọc so le, hình trứng hoặc hình bầu dục; đầu lá nhọn, gốc lá tròn hoặc hình tim; mép có răng cưa; gân hình chân vịt với 3–5 gân chính tỏa từ gốc; mặt lá xanh, hơi bóng, có thể ráp nhẹ; vò lá có cảm giác hơi nhớt.",
        "habitat": "Cây bụi thường xanh, ưa khí hậu nóng ẩm và ánh sáng; thích hợp với đất tơi xốp, giàu hữu cơ và thoát nước; được trồng phổ biến tại Việt Nam.",
        "preparation": "Lá tươi được sử dụng trong một số kinh nghiệm dân gian dưới dạng giã đắp ngoài da; có thể làm sạch trước khi sử dụng; cần thử phản ứng trên vùng da nhỏ và tránh dùng trên vết thương sâu.",
        "remedies": [
            "Lá được sử dụng theo kinh nghiệm dân gian trong chăm sóc da và một số vấn đề sưng viêm ngoài da.",
            "Các hoạt tính chống viêm và chống oxy hóa chủ yếu được nghiên cứu thực nghiệm."
        ],
        "caution": "Chưa đủ bằng chứng điều trị trên người; tránh dùng giã đắp trên vết thương hở sâu hoặc nhiễm trùng nặng.",
        "safety": "Thử dị ứng trên vùng da nhỏ trước khi đắp diện rộng."
    },
    "guava": {
        "name": "Ổi",
        "scientific": "Psidium guajava",
        "datasetName": "Guava",
        "usage": "Lá chứa tannin, quercetin, flavonoid và các hợp chất phenolic; được nghiên cứu về hoạt tính chống oxy hóa, kháng khuẩn và hỗ trợ kiểm soát đường huyết.",
        "identification": "Lá đơn mọc đối, hình bầu dục hoặc thuôn; đầu lá tù hoặc hơi nhọn; mép nguyên; gân hình lông chim với nhiều cặp gân phụ gần song song, nổi rõ ở mặt dưới; mặt trên xanh đậm, mặt dưới xanh nhạt và có lông mịn; vò lá có mùi thơm đặc trưng.",
        "habitat": "Cây bụi hoặc thân gỗ nhỏ, thích hợp khí hậu nhiệt đới và cận nhiệt đới; chịu được nhiều loại đất nhưng phát triển tốt trên đất thoát nước; phân bố rộng tại Việt Nam.",
        "preparation": "Lá non hoặc lá khô được sử dụng trong kinh nghiệm dân gian dưới dạng nước sắc; lá có thể được phơi hoặc sấy khô; không tự ý dùng thay thuốc điều trị tiêu chảy.",
        "remedies": [
            "Lá ổi được sử dụng theo kinh nghiệm dân gian liên quan đến tiêu chảy và làm săn se niêm mạc.",
            "Chiết xuất lá được nghiên cứu về kháng khuẩn, chống oxy hóa và hỗ trợ chuyển hóa glucose."
        ],
        "caution": "Hiệu quả điều trị trên người còn cần nghiên cứu thêm; không tự ý dùng thay thuốc điều trị bệnh lý cấp tính.",
        "safety": "Không uống nước sắc lá ổi quá đặc lúc bụng đói."
    },
    "grape": {
        "name": "Nho",
        "scientific": "Vitis vinifera",
        "datasetName": "Grape",
        "usage": "Lá chứa polyphenol, flavonoid và resveratrol với hàm lượng thay đổi theo giống và mẫu; được nghiên cứu về hoạt tính chống oxy hóa và bảo vệ mạch máu.",
        "identification": "Lá đơn mọc so le, phiến lá hình tim, thường chia 3–5 thùy; mép có răng cưa; gân chính tỏa hình chân vịt từ cuống; mặt trên xanh đậm, mặt dưới nhạt hơn và có thể có lông; cuống lá dài, gốc lá hình tim rõ.",
        "habitat": "Cây dây leo thân gỗ, thích hợp với khí hậu ấm, nhiều ánh sáng và độ ẩm vừa phải; cần đất thoát nước tốt; được trồng tại một số vùng ở Việt Nam như Ninh Thuận.",
        "preparation": "Lá nho được sử dụng làm thực phẩm ở một số nền ẩm thực; lá có thể được làm sạch và chế biến; không tự ý sử dụng chiết xuất lá làm thuốc điều trị.",
        "remedies": [
            "Lá nho được nghiên cứu về polyphenol và hoạt tính chống oxy hóa.",
            "Một số chế phẩm chiết xuất từ lá được khảo sát về hỗ trợ tuần hoàn tĩnh mạch."
        ],
        "caution": "Không xem lá tươi là thuốc điều trị bệnh mạch máu; không tự ý dùng chiết xuất lá làm thuốc điều trị.",
        "safety": "Đảm bảo lá sạch không tồn dư thuốc bảo vệ thực vật khi dùng trong ẩm thực."
    },
    "coffee": {
        "name": "Cà phê",
        "scientific": "Coffea arabica",
        "datasetName": "Coffee",
        "usage": "Lá chứa caffeine và các hợp chất phenolic như acid chlorogenic; được nghiên cứu về hoạt tính chống oxy hóa và thành phần sinh học; hàm lượng thay đổi theo giống và tuổi lá.",
        "identification": "Lá đơn mọc đối, hình bầu dục hoặc thuôn dài; đầu lá nhọn, mép nguyên nhưng thường lượn sóng; gân giữa nổi rõ, gân phụ hình lông chim; mặt trên xanh đậm bóng, mặt dưới nhạt hơn; cuống lá ngắn.",
        "habitat": "Cây bụi hoặc cây gỗ nhỏ, ưa khí hậu nhiệt đới và cận nhiệt đới; thích hợp với đất giàu hữu cơ, thoát nước và môi trường có độ ẩm phù hợp; được trồng nhiều tại Tây Nguyên.",
        "preparation": "Lá chủ yếu được sử dụng trong nghiên cứu thành phần hóa học; một số nơi có tập quán chế biến trà lá cà phê; cần chú ý caffeine và không tự ý dùng chiết xuất đậm đặc.",
        "remedies": [
            "Lá cà phê được nghiên cứu về hoạt tính chống oxy hóa và thành phần polyphenol.",
            "Một số nơi chế biến trà từ lá cà phê sấy khô."
        ],
        "caution": "Chưa có đủ bằng chứng lâm sàng xác nhận bài thuốc điều trị từ lá; cần chú ý hàm lượng caffeine.",
        "safety": "Người nhạy cảm với caffeine nên thận trọng khi uống trà lá cà phê."
    },
    "centella-asiatica": {
        "name": "Rau má",
        "scientific": "Centella asiatica",
        "datasetName": "Centella asiatica",
        "usage": "Lá chứa asiaticoside, madecassoside, asiatic acid và madecassic acid; được nghiên cứu về khả năng hỗ trợ lành da, chống viêm và chống oxy hóa.",
        "identification": "Lá đơn mọc từ thân bò, thường hình thận hoặc gần tròn; mép khía tai bèo; gân tỏa hình chân vịt từ vị trí cuống; mặt lá xanh, nhẵn hoặc hơi có lông; cuống lá dài, đính gần giữa phiến lá.",
        "habitat": "Cây thân thảo bò lan, ưa môi trường ẩm và ánh sáng nhẹ; thường mọc ở ruộng ẩm, ven mương và đất giàu mùn; phân bố phổ biến tại Việt Nam.",
        "preparation": "Lá tươi được sử dụng làm rau hoặc chế biến đồ uống sau khi rửa sạch; lá khô được dùng trong một số chế phẩm dược liệu; cần bảo đảm nguồn cây sạch và an toàn.",
        "remedies": [
            "Rau má được sử dụng trong y học cổ truyền để hỗ trợ thanh nhiệt và chăm sóc da.",
            "Các triterpenoid được nghiên cứu rộng rãi về tác dụng làm lành vết thương và chống oxy hóa."
        ],
        "caution": "Có thể gây kích ứng hoặc ảnh hưởng gan ở một số trường hợp khi dùng chế phẩm không phù hợp hoặc lạm dụng quá mức.",
        "safety": "Rửa thật sạch nhiều lần trước khi ăn sống hoặc ép nước; không dùng liên tục liều cao kéo dài."
    },
    "bitter-gourd": {
        "name": "Khổ qua (Mướp đắng)",
        "scientific": "Momordica charantia",
        "datasetName": "Bitter Gourd",
        "usage": "Lá chứa flavonoid, polyphenol và các hợp chất sinh học; được nghiên cứu về hoạt tính chống oxy hóa, kháng khuẩn và chuyển hóa glucose; bằng chứng chủ yếu từ nghiên cứu thực nghiệm.",
        "identification": "Lá đơn mọc so le, hình trứng hoặc hình thận; phiến lá chia sâu thành 5–7 thùy; gân tỏa hình chân vịt; mép thùy có răng cưa hoặc khía; hai mặt xanh, có lông thưa; vò lá có mùi đặc trưng.",
        "habitat": "Cây dây leo thân thảo, ưa khí hậu nóng ẩm và nhiều ánh sáng; thích hợp với đất tơi xốp, giàu hữu cơ và thoát nước tốt; được trồng phổ biến tại Việt Nam.",
        "preparation": "Lá được sử dụng trong một số món ăn và kinh nghiệm dân gian; có thể dùng tươi sau khi làm sạch và chế biến phù hợp; không tự ý uống nước ép hoặc nước sắc đậm đặc.",
        "remedies": [
            "Lá khổ qua được nghiên cứu về khả năng hỗ trợ chuyển hóa glucose trong nghiên cứu thực nghiệm.",
            "Lá tươi được dùng theo một số kinh nghiệm dân gian (nấu canh thanh nhiệt, nước tắm)."
        ],
        "caution": "Chưa đủ bằng chứng xác nhận hiệu quả điều trị tiểu đường ở người; cần thận trọng vì có thể ảnh hưởng đường huyết.",
        "safety": "Người có tiền sử tụt đường huyết nên thận trọng khi dùng lượng lớn."
    },
    "aloevera": {
        "name": "Nha đam (Lô hội)",
        "scientific": "Aloe vera",
        "datasetName": "Aloevera",
        "usage": "Lá chứa polysaccharide, đặc biệt là acemannan trong phần gel; gel được nghiên cứu về khả năng làm dịu da và hỗ trợ lành vết thương; lớp nhựa vàng chứa aloin có tác dụng nhuận tràng và nguy cơ gây độc.",
        "identification": "Lá mọc thành cụm hình hoa thị, dày, mọng nước, hình mũi mác dài; mép lá có gai nhỏ; gân không nổi rõ, phiến lá xanh lục hoặc xanh xám; mặt lá nhẵn, có thể có đốm trắng khi còn non; bên trong chứa gel trong suốt và lớp nhựa vàng gần vỏ.",
        "habitat": "Cây mọng nước, ưa khí hậu nóng, khô và nhiều ánh sáng; thích hợp với đất cát pha, thoát nước rất tốt; được trồng phổ biến tại Việt Nam.",
        "preparation": "Gel trong suốt bên trong lá được sử dụng ngoài da trong một số sản phẩm chăm sóc; cần loại bỏ hoàn toàn phần nhựa vàng; không tự ý uống dịch từ lá nguyên hoặc nhựa nha đam.",
        "remedies": [
            "Gel nha đam được nghiên cứu về hỗ trợ làm dịu da và lành vết bỏng nhẹ.",
            "Được ứng dụng rộng rãi trong các chế phẩm chăm sóc và dưỡng ẩm da."
        ],
        "caution": "Nhựa vàng chứa aloin có thể gây đau bụng và tiêu chảy; không sử dụng nhựa hoặc chiết xuất toàn lá để tự điều trị.",
        "safety": "Chỉ dùng phần gel trong sau khi rửa sạch nhựa vàng; không bôi lên vết thương hở sâu."
    },
    "mango": {
        "name": "Xoài",
        "scientific": "Mangifera indica",
        "datasetName": "Mango",
        "usage": "Lá chứa mangiferin, flavonoid và polyphenol; được nghiên cứu về hoạt tính chống oxy hóa, chống viêm và kháng khuẩn.",
        "identification": "Lá đơn mọc so le, hình thuôn dài hoặc mũi mác; gân hình lông chim, gân giữa nổi rõ, mép nguyên; mặt trên xanh đậm bóng, mặt dưới xanh nhạt; lá non đỏ đồng; vò lá có mùi đặc trưng.",
        "habitat": "Cây nhiệt đới, ưa khí hậu nóng, nhiều ánh sáng; thích hợp với đất phù sa, đất thịt thoát nước tốt; phân bố rộng tại Việt Nam.",
        "preparation": "Lá tươi hoặc lá khô được sử dụng trong một số kinh nghiệm dân gian dưới dạng nước sắc; cần làm sạch và phơi hoặc sấy khô; không tự ý sử dụng để điều trị bệnh.",
        "remedies": [
            "Lá xoài được dùng trong một số bài thuốc dân gian liên quan đến ho và tiêu hóa.",
            "Chiết xuất lá được nghiên cứu về chống oxy hóa, chống viêm và mangiferin."
        ],
        "caution": "Chưa đủ bằng chứng chứng minh hiệu quả điều trị trên người; thận trọng với nguy cơ dị ứng mủ lá.",
        "safety": "Cần làm sạch phấn và mủ lá trước khi sử dụng dân gian."
    }
};

if (window.HerbaPediaHerbs && Array.isArray(window.HerbaPediaHerbs)) {
    window.HerbaPediaHerbs.forEach(herb => {
        if (OFFICIAL_16_HERBS_DATA[herb.id]) {
            const d = OFFICIAL_16_HERBS_DATA[herb.id];
            herb.name = d.name;
            herb.scientific = d.scientific;
            herb.usage = d.usage;
            herb.identification = d.identification;
            herb.habitat = d.habitat;
            herb.preparation = d.preparation;
            herb.remedies = d.remedies;
            herb.caution = d.caution;
            herb.safety = d.safety;
            herb.usageDetails = [
                `Đặc điểm dược tính: ${d.usage}`,
                `Cách chế biến & dùng: ${d.preparation}`,
                `Lưu ý & an toàn: ${d.caution}`
            ];
        }
    });
}


// === DỮ LIỆU DƯỢC LIỆU 26 LOÀI BỔ SUNG CHUẨN XÁC DƯỢC HỌC VÀ Y HỌC CỔ TRUYỀN ===
const OFFICIAL_26_HERBS_DATA = {
    "betel": {
        "usage": "Chứa tinh dầu giàu chavicol, betel-phenol và eugenol; có tác dụng kháng sinh và sát khuẩn tự nhiên cực mạnh đối với tụ cầu khuẩn, trực khuẩn mủ xanh và nấm; làm ấm tỳ vị và giảm đau.",
        "identification": "Dây leo thân nhẵn, có rễ bám ở các mấu. Lá mọc so le hình tim hoặc trứng thuôn, đầu lá nhọn, phiến lá dày láng bóng màu xanh lục sẫm, vò nát có mùi thơm cay hăng nồng.",
        "parts": "Lá tươi hoặc phơi khô (Folium Piperis betle).",
        "habitat": "Cây ưa ẩm, nhiều ánh sáng, phát triển mạnh ở vùng nhiệt đới; được trồng leo giàn khắp các vùng nông thôn Việt Nam.",
        "preparation": "Hái lá bánh tẻ tươi rửa sạch, ngâm nước muối; dùng tươi giã nát đắp ngoài hoặc đun sôi kỹ lấy nước rửa sát trùng.",
        "remedies": [
            "Sát trùng vết thương, mụn nhọt, ngứa da: Lá trầu không tươi 50g rửa sạch, đun sôi với 1 lít nước và chút muối hạt, dùng rửa hoặc ngâm vùng da tổn thương.",
            "Chữa viêm họng, viêm nướu, hôi miệng: Dùng 3-5 lá trầu không giã nát, hòa với nước ấm rồi lọc lấy nước cốt súc miệng 2-3 lần/ngày.",
            "Giảm ho, cảm lạnh: Hơ ấm lá trầu không rồi miết nhẹ lên ngực, lưng và bụng giúp làm ấm cơ thể."
        ],
        "caution": "Không dùng nước lá trầu không đậm đặc thụt rửa sâu vùng kín kéo dài; không đắp lá lên vết thương hở sâu đang chảy máu.",
        "safety": "Chỉ dùng ngoài da hoặc súc miệng nhổ bỏ; không tự ý uống nước ép lá trầu không liều cao."
    },
    "bhrami": {
        "usage": "Chứa các saponin triterpenoid nhóm Bacoside A và Bacoside B; có hoạt tính bảo vệ tế bào thần kinh, cải thiện khả năng ghi nhớ, tăng dẫn truyền synap và an thần nhẹ.",
        "identification": "Cây thân thảo nhỏ mọc bò lan trên bùn, thân mọng nước phân nhánh nhiều. Lá nhỏ mọng nước hình thìa mọc đối không cuống. Hoa nhỏ màu trắng hoặc tím nhạt mọc đơn độc ở nách lá.",
        "parts": "Toàn cây trên mặt đất tươi hoặc khô (Herba Bacopae monnieri).",
        "habitat": "Ưa nơi đầm lầy, ẩm ướt, ruộng nước và ven kênh mương khắp đồng bằng Bắc Bộ và Nam Bộ.",
        "preparation": "Thu hái toàn cây rửa sạch bùn đất, dùng tươi ép lấy nước hoặc phơi trong bóng râm (âm can) sắc thuốc.",
        "remedies": [
            "Hỗ trợ tăng cường trí nhớ, giảm căng thẳng thần kinh: Dùng 10-15g rau đắng biển khô (hoặc 30g tươi) sắc nước uống ấm hàng ngày.",
            "Thanh nhiệt giải độc, an thần: Nấu canh rau đắng biển với cá đồng hoặc thịt nạc ăn thanh mát trong bữa cơm."
        ],
        "caution": "Dùng liều cao có thể gây kích ứng đường tiêu hóa, buồn nôn, cồn cào ruột; người có nhịp tim chậm nên thận trọng.",
        "safety": "Phụ nữ mang thai và cho con bú không nên tự ý dùng các chế phẩm rau đắng biển liều cao."
    },
    "bringaraja": {
        "usage": "Chứa wedelolactone, ecliptine và tinh dầu; quy kinh Can Thận. Tác dụng lương huyết, chỉ huyết (cầm máu), bổ can thận âm, làm đen râu tóc và kháng viêm bảo vệ tế bào gan.",
        "identification": "Cây thân thảo mọc thẳng hoặc bò, thân có lông cứng ráp màu lục hoặc nâu đỏ. Lá mọc đối hình mũi mác hẹp, mép có răng cưa nhỏ. Cụm hoa đầu hình hoa cúc nhỏ màu trắng nở ở nách lá; khi vò nát chảy dịch đen nhánh đặc trưng.",
        "parts": "Toàn cây tươi hoặc phơi khô (Herba Ecliptae).",
        "habitat": "Mọc hoang khắp bờ ruộng, bãi cỏ ẩm, ven đường và các vùng đất hoang nhiệt đới.",
        "preparation": "Nhổ toàn cây rửa sạch bùn đất rễ; dùng tươi giã nát vắt nước cốt hoặc phơi khô nấu nước sắc.",
        "remedies": [
            "Cầm máu nhanh (chảy máu cam, trầy xước, rong kinh): Cỏ mực tươi một nắm rửa sạch, giã nát vắt lấy nước cốt uống, bã sạch đắp trực tiếp lên vết thương.",
            "Hỗ trợ chữa tóc bạc sớm, rụng tóc: Cỏ mực khô 20g, hà thủ ô đỏ 15g, thục địa 15g sắc nước uống đều đặn.",
            "Hạ sốt, viêm họng ở trẻ em: Cỏ mực tươi 30g, rau má 30g giã nát vắt nước uống."
        ],
        "caution": "Người tỳ vị hư hàn, hay đau bụng đầy trướng hoặc tiêu chảy sống phân không nên dùng đơn độc liều lớn.",
        "safety": "Cây mọc sát đất cần rửa sạch nhiều lần bằng nước muối trước khi vắt nước uống tươi."
    },
    "castor": {
        "usage": "Dầu ép từ hạt (dầu thầu dầu) chứa axit ricinoleic có tác dụng nhuận tràng, tẩy xổ mạnh ở ruột non. Lá thầu dầu có tác dụng tiêu thũng bài nùng, chống ngứa ngoài da.",
        "identification": "Cây thân gỗ nhỏ cao 2-4m, thân tròn có phấn trắng. Lá lớn xẻ thùy chân vịt sâu 7-9 thùy cuống dài. Quả nang có gai mềm chứa 3 hạt có vân hoa đốm nâu xám bóng loáng giống con bọ ve.",
        "parts": "Dầu tinh chế từ hạt; lá tươi dùng ngoài (Folium Ricini). TUYỆT ĐỐI KHÔNG DÙNG HẠT SỐNG.",
        "habitat": "Mọc hoang và được trồng lấy dầu công nghiệp tại các vùng đất bãi bồi, đồi núi trung du.",
        "preparation": "Hạt ép lạnh tinh chế loại bỏ độc tố công nghiệp; lá tươi hơ nóng hoặc giã nát đắp ngoài.",
        "remedies": [
            "Dùng ngoài chữa sa tử cung, sa trực tràng: Lá thầu dầu tươi giã nát với giấm ấm đắp lên huyệt bách hội (đỉnh đầu), khi thấy tạng phủ co lên thì gỡ bỏ ngay.",
            "Tẩy xổ khi táo bón nặng: Dùng 10-20ml dầu thầu dầu đã loại bỏ độc tố theo chỉ định chặt chẽ của bác sĩ."
        ],
        "caution": "Hạt thầu dầu sống chứa protein độc RICIN cực mạnh (chỉ 3-5 hạt có thể gây tử vong ở trẻ em). Tuyệt đối không tự ý nhai nuốt hạt sống.",
        "safety": "Phụ nữ có thai, người viêm ruột cấp và trẻ nhỏ tuyệt đối cấm dùng đường uống."
    },
    "catharanthus": {
        "usage": "Toàn cây chứa hơn 70 alkaloid nhóm indol, tiêu biểu là vinblastine và vincristine có hoạt tính ức chế phân bào dùng trong điều trị ung thư (bạch cầu, u lympho); rễ chứa ajmalicine giúp hạ huyết áp và an thần.",
        "identification": "Cây bụi nhỏ cao 40-80cm, thân tròn nhẵn. Lá mọc đối hình bầu dục ngược đầu tù gốc thon, mặt trên xanh đậm bóng. Hoa 5 cánh màu hồng, đỏ hoặc trắng mọc ở kẽ lá.",
        "parts": "Rễ và lá (Herba Catharanthi rosei).",
        "habitat": "Trồng làm cảnh và trồng vùng nguyên liệu dược phẩm; thích nghi tốt ở đất cát ven biển và vùng nắng nóng.",
        "preparation": "Thu hái rễ và lá phơi khô trong bóng râm, sắc nước uống theo liều nghiêm ngặt.",
        "remedies": [
            "Hỗ trợ hạ huyết áp, an thần nhẹ: Thân lá dừa cạn phơi khô 10g hãm nước sôi uống (chỉ dùng dạng trà hỗ trợ ngắn ngày).",
            "Ứng dụng y học hiện đại: Chiết xuất vinblastine và vincristine điều chế thuốc tiêm điều trị ung thư theo phác đồ bệnh viện."
        ],
        "caution": "Alkaloid trong dừa cạn có độc tính tích lũy gây suy tủy xương, rụng tóc và độc thần kinh. Không tự ý sắc uống liều cao thay thuốc chữa ung thư.",
        "safety": "Chống chỉ định tuyệt đối cho phụ nữ có thai, người suy gan suy thận và người huyết áp thấp."
    },
    "chilly": {
        "usage": "Quả chứa capsaicin kích thích thụ thể nhiệt tạo vị cay nồng, làm giãn mạch máu ngoại vi, giảm đau cơ xương khớp, kích thích tiết dịch vị và tăng cường đốt cháy năng lượng.",
        "identification": "Cây thân thảo sống dai, cành phân nhánh nhiều. Lá đơn mọc so le hình mũi mác mép nguyên. Quả mọng mọc đứng hoặc rủ, nhiều hình dạng, khi chín chuyển sang màu đỏ tươi hoặc vàng cam cay nồng.",
        "parts": "Quả chín (Fructus Capsici), lá ớt.",
        "habitat": "Cây gia vị nhiệt đới trồng phổ biến khắp các vùng nông thôn và vườn nhà Việt Nam.",
        "preparation": "Quả dùng tươi làm gia vị hoặc ngâm rượu xoa bóp ngoài da; lá non hái rửa sạch nấu canh.",
        "remedies": [
            "Xoa bóp giảm đau nhức xương khớp, đau dây thần kinh: Quả ớt chín ngâm rượu trắng xoa bóp ngoài da giúp giảm đau cục bộ.",
            "Thanh nhiệt lợi tiểu (lá ớt): Lá ớt non nấu canh với tôm đồng ăn giải nhiệt nhẹ và kích thích tiêu hóa."
        ],
        "caution": "Capsaicin đậm đặc gây kích ứng bỏng rát niêm mạc dạ dày, bỏng da và giác mạc; người viêm loét dạ dày tá tràng thể nóng không ăn nhiều.",
        "safety": "Rửa sạch tay sau khi chạm vào ớt tươi; tránh để dính vào mắt hoặc vết trầy xước."
    },
    "citron-lime": {
        "usage": "Dịch quả chứa axit citric và vitamin C dồi dào giúp kích thích tiêu hóa, sinh tân chỉ khát, làm sạch dịch đờm; vỏ quả chứa tinh dầu kháng khuẩn mạnh, giải cảm sốt.",
        "identification": "Cây thân gỗ nhỏ có nhiều gai nhọn cứng. Lá đơn mọc so le hình bầu dục mép có răng cưa nhỏ. Quả nhỏ hình cầu đường kính 3-4cm, khi chín vỏ màu xanh vàng mỏng, thịt quả rất chua.",
        "parts": "Quả (dịch quả và vỏ quả - Pericarpium Citri), lá chanh ta.",
        "habitat": "Trồng trọt rộng rãi khắp các vùng nông nghiệp nhiệt đới ẩm Việt Nam.",
        "preparation": "Vắt lấy nước cốt pha loãng; vỏ quả thái mỏng ngâm muối hoặc nấu nồi nước xông.",
        "remedies": [
            "Giải nhiệt, chống mất nước: Nước cốt 1 quả chanh ta pha với 200ml nước ấm và mật ong uống giải khát sau khi vận động.",
            "Xông giải cảm sốt, thông mũi: Lá chanh ta, lá bưởi, sả, hương nhu đun sôi xông toàn thân 10 phút.",
            "Giảm ngứa họng, ho gió: Vỏ chanh ta thái lát ngậm với hạt muối hột."
        ],
        "caution": "Nước cốt chanh đậm đặc có độ pH thấp gây mòn men răng và tăng tiết axit dạ dày nếu uống lúc đói.",
        "safety": "Súc miệng bằng nước lọc sau khi uống nước chanh; tránh bôi tinh dầu lên da trước khi ra nắng."
    },
    "coriender": {
        "usage": "Chứa tinh dầu d-linalool (60-70%) và các chất chống oxy hóa; vị cay tính ấm quy kinh Phế Tỳ. Tác dụng phát hãn thấu chẩn (thúc sởi mọc nhanh), kiện tỳ tiêu thực, trừ mùi hôi và kích thích tiêu hóa.",
        "identification": "Cây thảo nhỏ sống hàng năm, thân rỗng tròn cao 30-50cm. Lá phía gốc có cuống dài, phiến lá chia thùy hình tròn khía răng; lá trên ngọn xẻ thùy hình sợi mảnh. Toàn cây có mùi thơm dễ chịu.",
        "parts": "Quả phơi khô (Fructus Coriandri) và toàn cây tươi.",
        "habitat": "Cây rau gia vị ưa mát trồng vụ đông xuân ở hầu hết các tỉnh thành Việt Nam.",
        "preparation": "Hạt phơi khô sao thơm hãm trà; thân lá tươi rửa sạch ăn sống hoặc nấu canh, đun nước tắm.",
        "remedies": [
            "Thúc sởi mọc nhanh, giải độc sởi ở trẻ: Quả mùi 20g sắc lấy nước lau người hoặc đun sôi xông nhẹ cho trẻ.",
            "Chữa đầy bụng, ăn không tiêu, ợ hơi: Quả mùi khô 10g sao thơm, hãm nước sôi uống ấm sau bữa ăn.",
            "Nước tắm tất niên thanh lọc cơ thể: Đun một nắm lớn cây mùi già có hoa quả lấy nước tắm thơm mát."
        ],
        "caution": "Người mắc bệnh hen phế quản, viêm khí quản mạn tính nên thận trọng vì mùi tinh dầu có thể gây co thắt nhẹ.",
        "safety": "Rửa sạch đất cát rễ khi ăn sống; dùng an toàn làm gia vị thực phẩm."
    },
    "curry": {
        "usage": "Lá chứa các alkaloid carbazole độc đáo (mahanimbine, girinimbine) và tinh dầu; có hoạt tính chống oxy hóa, bảo vệ tế bào gan, kháng khuẩn và hỗ trợ giảm cholesterol trong máu.",
        "identification": "Cây bụi hoặc thân gỗ nhỏ cao 2-4m. Lá kép lông chim mọc so le mang 11-25 lá chét hình mũi mác không đối xứng ở gốc, khi vò nát tỏa mùi thơm nồng gia vị cà ri đặc trưng.",
        "parts": "Lá tươi và lá phơi khô (Folium Murrayae koenigii).",
        "habitat": "Nguồn gốc Nam Á, hiện được di thực trồng làm gia vị và dược liệu tại nhiều tỉnh phía Nam.",
        "preparation": "Dùng lá tươi sao nhẹ hoặc nấu trực tiếp trong món ăn; lá khô tán bột gia vị.",
        "remedies": [
            "Hỗ trợ giảm mỡ máu, cải thiện tiêu hóa: Nhai nuốt 6-8 lá cà ri tươi mỗi sáng hoặc dùng làm gia vị trong các món nấu.",
            "Dưỡng tóc, giảm gàu ngứa chân tóc: Nấu nước lá cà ri gội đầu giúp kích thích mọc tóc và nuôi dưỡng da đầu."
        ],
        "caution": "Không thay thế hoàn toàn thuốc điều trị rối loạn mỡ máu hoặc đái tháo đường kê đơn.",
        "safety": "Sử dụng an toàn trong khẩu phần ẩm thực hàng ngày."
    },
    "doddpathre": {
        "usage": "Lá chứa tinh dầu giàu carvacrol và colein có tác dụng kháng sinh tự nhiên cực mạnh đối với phế cầu khuẩn, trực khuẩn ho gà và tụ cầu vàng; tiêu đờm, chỉ khái, giải cảm và hạ sốt.",
        "identification": "Cây thân thảo sống dai cao 20-50cm, thân mọng nước có lông mịn. Lá mọc đối dày mọng nước hình tim tròn mép có răng cưa lượn sóng tròn, mặt lá phủ lớp lông tơ mềm; vò lá có mùi thơm chanh the mát dễ chịu.",
        "parts": "Lá và ngọn non tươi (Folium Colei amboinici).",
        "habitat": "Dễ trồng bằng cành giâm, phát triển tốt ở vườn nhà, chậu cảnh khắp các miền đất nước.",
        "preparation": "Hái lá tươi rửa sạch ngâm muối; chưng cách thủy với đường phèn hoặc giã nát vắt nước.",
        "remedies": [
            "Đặc trị ho có đờm, viêm họng ở trẻ em và người lớn: Lá húng chanh tươi 15g rửa sạch, thái nhỏ chưng cách thủy với đường phèn hoặc mật ong, ngậm nuốt nước cốt từ từ 3-4 lần/ngày.",
            "Chữa cảm cúm, sốt không ra mồ hôi: Lá húng chanh tươi 20g, gừng tươi 3 lát sắc nước uống ấm rồi đắp chăn cho toát mồ hôi.",
            "Giảm đau rát do côn trùng cắn: Giã nát lá húng chanh đắp trực tiếp lên vết đốt."
        ],
        "caution": "Lá tươi có nhiều lông tơ mịn, người có cơ địa quá mẫn cần rửa sạch tránh gây ngứa họng khi nhai sống.",
        "safety": "Rất an toàn cho cả trẻ nhỏ và phụ nữ cho con bú khi dùng chưng đường phèn."
    },
    "drumstick": {
        "usage": "Lá chứa hàm lượng cực cao vitamin C, vitamin A, canxi, sắt, protein thực vật và polyphenol (quercetin, chlorogenic acid); bồi bổ cơ thể suy nhược, tăng tiết sữa, hạ huyết áp và chống viêm loét.",
        "identification": "Cây thân gỗ nhỏ cao 5-10m, vỏ cây có rãnh nứt. Lá kép lông chim 3 lần mọc so le mang nhiều lá chét nhỏ hình trứng tròn. Quả dài hình que có 3 cạnh chứa hạt có cánh mỏng.",
        "parts": "Lá non, búp, quả non và hạt (Folium & Semen Morinagae).",
        "habitat": "Cây chịu hạn tốt, mọc nhanh, được trồng nhiều ở các tỉnh miền Trung và Nam Bộ.",
        "preparation": "Lá non tuốt rửa sạch nấu canh ăn chín; lá sấy lạnh nghiền bột dinh dưỡng.",
        "remedies": [
            "Bồi bổ sức khỏe cho người già, trẻ còi xương: Lá chùm ngây non nấu canh với tôm thịt ăn 2-3 lần/tuần.",
            "Lợi sữa cho sản phụ sau sinh: Lá chùm ngây non 100g nấu canh ăn nóng giúp tăng tiết sữa tự nhiên.",
            "Bột lá chùm ngây làm thực phẩm bổ sung: Lá sấy lạnh nghiền bột mịn pha nước uống bổ sung vi chất dinh dưỡng."
        ],
        "caution": "Phụ nữ đang mang thai TUYỆT ĐỐI KHÔNG ăn nhiều chùm ngây vì hoạt chất alpha-sitosterol gây co bóp cơ trơn tử cung dẫn tới nguy cơ sảy thai.",
        "safety": "Không ăn chùm ngây vào buổi tối muộn vì hàm lượng vitamin C cao có thể gây mất ngủ."
    },
    "eucalyptus": {
        "usage": "Lá chứa 1.5–3.5% tinh dầu giàu Cineol (Eucalyptol > 70%) có tác dụng sát trùng đường hô hấp cực mạnh, tiêu đờm, giãn phế quản, giảm đau cơ khớp và xua đuổi côn trùng.",
        "identification": "Cây thân gỗ lớn cao 20-30m, vỏ thân dễ bóc thành từng dải dài. Lá cây trưởng thành mọc so le hình lưỡi liềm thuôn dài cuống ngắn, phiến lá dày có nhiều túi tinh dầu trong suốt li ti; vò lá có mùi tinh dầu khuynh diệp bốc lên mũi.",
        "parts": "Lá phơi khô và tinh dầu chiết xuất (Folium & Oleum Eucalypti).",
        "habitat": "Trồng trọt thành rừng phòng hộ và vùng nguyên liệu lấy gỗ, tinh dầu ở khắp các tỉnh đồi núi và trung du.",
        "preparation": "Lá khô đun nước xông mũi họng; tinh dầu pha loãng với dầu nền để xoa bóp ngoài da.",
        "remedies": [
            "Xông thông mũi, giảm nghẹt mũi sổ mũi: Lá bạch đàn khô 20g (hoặc 3-5 giọt tinh dầu) cho vào bát nước sôi trùm khăn xông mũi họng.",
            "Xoa bóp giữ ấm, giảm đau cơ: Dùng dầu khuynh diệp xoa bóp vùng ngực, lòng bàn chân và các khớp sưng đau khi trời lạnh.",
            "Sát khuẩn không khí phòng ngủ: Xông tinh dầu khuynh diệp bằng đèn xông giúp thanh lọc không khí và phòng cảm cúm."
        ],
        "caution": "TUYỆT ĐỐI KHÔNG UỐNG tinh dầu bạch đàn nguyên chất vì có thể gây ngộ độc ức chế hô hấp cấp tính. Không bôi trực tiếp tinh dầu nguyên chất lên mặt trẻ sơ sinh.",
        "safety": "Chỉ dùng ngoài da (pha loãng với dầu nền) hoặc xông hơi hít thở."
    },
    "ginger": {
        "usage": "Thân rễ chứa tinh dầu và các chất cay gingerol, shogaol; tính ấm vị cay quy kinh Phế Tỳ Vị. Tác dụng phát biểu tán hàn (giải cảm lạnh), ôn trung chỉ ẩu (làm ấm dạ dày, cầm nôn), hóa đàm chỉ khái và tăng tuần hoàn máu.",
        "identification": "Cây thân thảo sống lâu năm cao 0.6-1m. Thân rễ nạc phình to phân nhiều nhánh nằm ngang dưới đất, vỏ màu vàng nhạt, ruột vàng có mùi thơm cay nồng đặc trưng. Lá không cuống mọc so le hình mũi mác dài.",
        "parts": "Thân rễ tươi (Sinh khương - Rhizoma Zingiberis recens) hoặc khô (Can khương).",
        "habitat": "Cây gia vị dược liệu cổ truyền trồng rộng khắp các vùng sinh thái từ đồng bằng đến miền núi.",
        "preparation": "Củ rửa sạch đất, để nguyên vỏ hoặc cạo nhẹ; thái lát mỏng hãm nước sôi hoặc nướng chín.",
        "remedies": [
            "Chữa cảm lạnh, trúng gió, lạnh bụng đi ngoài: Gừng tươi 20g đập dập, thêm chút đường phèn nấu với 200ml nước uống ấm nóng rồi đắp chăn.",
            "Chống say tàu xe, giảm ốm nghén nhẹ: Ngậm một lát gừng tươi nhai nuốt nước từ từ trước khi lên xe 30 phút.",
            "Giảm đau nhức xương khớp, lạnh chân tay: Ngâm chân nước ấm pha gừng giã nát và muối hột 20 phút mỗi tối trước khi ngủ."
        ],
        "caution": "Không dùng nhiều cho người có thể trạng nhiệt (đang sốt cao, vã mồ hôi, trĩ chảy máu, ho ra máu); tránh ăn gừng bị thối hỏng vì chứa safrole gây độc gan.",
        "safety": "Người cao huyết áp nên thận trọng không uống trà gừng quá đặc vào ban đêm."
    },
    "henna": {
        "usage": "Lá chứa lawsone (hydroxynaphthoquinone) có ái lực gắn kết bền vững với keratin của tóc và da tạo màu nhuộm tự nhiên; có hoạt tính kháng nấm, làm se niêm mạc và làm dịu vết bỏng nhẹ.",
        "identification": "Cây bụi hoặc thân gỗ nhỏ cao 2-4m, cành có gai ở đầu. Lá mọc đối hình bầu dục hay mũi mác ngắn, phiến lá dai nhẵn bóng. Cụm hoa chùm ở đầu cành màu trắng hoặc đỏ thơm ngát.",
        "parts": "Lá phơi khô tán bột (Folium Lawsoniae).",
        "habitat": "Nguồn gốc Trung Đông và Nam Á; trồng làm cảnh và cây nhuộm ở một số vùng phía Nam Việt Nam.",
        "preparation": "Lá phơi khô nghiền thành bột mịn, hòa với nước ấm hoặc nước trà để ủ nhuộm tóc ngoài da.",
        "remedies": [
            "Nhuộm tóc và dưỡng tóc tự nhiên: Bột lá móng hòa với nước ấm thành hỗn hợp sệt, ủ tóc 1-2 giờ rồi xả sạch giúp phủ bạc và bóng tóc an toàn.",
            "Chữa nấm móng, nước ăn chân: Lá móng tươi giã nát với chút muối và giấm đắp vào kẽ chân bị nấm."
        ],
        "caution": "Cần phân biệt bột lá móng thuần khiết tự nhiên với sản phẩm 'Henna đen' hóa học có pha p-phenylenediamine (PPD) - chất gây dị ứng và bỏng da nghiêm trọng.",
        "safety": "Chỉ dùng ngoài da; thử dị ứng trên mu bàn tay 24 giờ trước khi nhuộm diện rộng."
    },
    "jasmine": {
        "usage": "Hoa chứa tinh dầu thơm quý (benzyl acetate, linalool, methyl jasmonate); vị cay ngọt tính mát. Tác dụng sơ can giải uất, thanh nhiệt giáng hỏa, trấn tĩnh an thần, giảm lo âu căng thẳng và hạ huyết áp nhẹ.",
        "identification": "Cây bụi nhỏ cành mảnh vươn dài. Lá mọc đối hình bầu dục bóng ở mặt trên. Cụm hoa mọc ở ngọn cành màu trắng muốt tinh khiết, cánh hoa xếp nhiều lớp, nở về đêm và tỏa mùi thơm ngọt ngào nồng nàn.",
        "parts": "Hoa mới nở (Flos Jasmini sambac) và rễ.",
        "habitat": "Cây cảnh thơm truyền thống trồng ở sân vườn khắp ba miền đất nước.",
        "preparation": "Hái hoa vào chiều muộn khi nụ sắp nở, ướp với trà hoặc sấy lạnh làm trà hoa cúc lài.",
        "remedies": [
            "Trà hoa lài dưỡng tâm an thần, dễ ngủ: Hoa lài tươi 5 bông (hoặc nụ khô) hãm với nước sôi 85°C uống ấm trước giờ ngủ 1 tiếng.",
            "Thanh nhiệt giải cảm nắng, hoa mắt chóng mặt: Hoa lài 10g, hoa cúc trắng 10g hãm trà uống giải nhiệt ngày hè."
        ],
        "caution": "Không sử dụng hoa lài cảnh bị phun hóa chất bảo quản hoặc hương liệu nhân tạo để pha trà.",
        "safety": "Rất an toàn khi dùng hoa sạch tự nhiên để ướp trà thưởng thức."
    },
    "lantana": {
        "usage": "Lá và hoa chứa tinh dầu, triterpenoid (lantadene A, B); dùng trong dân gian để sát trùng ngoài da, tiêu độc, giảm ngứa. Rễ có tác dụng thanh nhiệt hạ sốt.",
        "identification": "Cây bụi nhỏ cành vuông có gai quặp. Lá mọc đối hình trứng mép có răng cưa nhọn, mặt lá nhám ráp có lông cứng; vò lá có mùi hăng hắc khó ngửi. Cụm hoa hình tán tròn nhiều hoa nhỏ đổi màu từ vàng, cam sang đỏ hoặc hồng.",
        "parts": "Rễ và lá dùng ngoài. TUYỆT ĐỐI KHÔNG ĂN QUẢ XANH.",
        "habitat": "Cây hoang dại mọc thành bụi rậm ở ven đồi, bãi hoang và trồng làm hàng rào hoa.",
        "preparation": "Hái lá tươi rửa sạch đun nước tắm rửa hoặc giã nát đắp ngoài nốt mụn sưng.",
        "remedies": [
            "Nấu nước tắm chữa ghẻ lở, ngứa da, viêm da: Lá ngũ sắc tươi 50g đun sôi với 2 lít nước và muối hạt, dùng rửa hoặc ngâm chỗ ngứa.",
            "Giảm sưng tấy mụn nhọt ngoài da: Lá tươi giã nát đắp lên nốt mụn nhọt chưa vỡ mủ."
        ],
        "caution": "Quả xanh của cây ngũ sắc chứa lantadene A rất độc, có thể gây nôn mửa, giãn đồng tử và tổn thương gan nếu trẻ nhỏ ăn phải. Tuyệt đối không tự sắc uống lá tươi.",
        "safety": "Chỉ sử dụng ngoài da; trồng cách xa tầm tay trẻ nhỏ."
    },
    "lemongrass": {
        "usage": "Thân lá chứa 1–2% tinh dầu giàu Citral (65–85%) và Geraniol; vị cay thơm tính ấm. Tác dụng thông tiểu, tiêu thực, giải độc rượu, kích thích tiêu hóa, phát hãn giải cảm và ức chế nấm mốc vi khuẩn.",
        "identification": "Cây thân thảo sống lâu năm mọc thành bụi dày. Lá dài hẹp như lá lúa mép ráp, bẹ lá cuốn chặt ôm lấy nhau tạo thành thân giả màu trắng xanh hoặc tím nhẹ; toàn thân tỏa mùi thơm chanh sảng khoái.",
        "parts": "Thân rễ giả và lá tươi (Herba Cymbopogonis).",
        "habitat": "Cây gia vị trồng trọt phổ biến khắp các khu vườn từ nông thôn đến thành thị.",
        "preparation": "Đập dập thân sả nấu nước xông hoặc nấu canh, hãm trà ấm với gừng.",
        "remedies": [
            "Nồi xông giải cảm cúm, nhức đầu nghẹt mũi: Củ sả đập dập 5 củ, lá chanh, lá bưởi, hương nhu đun sôi xông mồ hôi toàn thân.",
            "Hỗ trợ tiêu hóa, giảm trướng bụng đầy hơi: Củ sả 20g đập dập, gừng 10g nấu nước sôi thêm chút đường uống ấm sau bữa ăn.",
            "Xua đuổi muỗi và khử mùi phòng: Xịt tinh dầu sả chanh hoặc đốt tinh dầu trong phòng ngủ."
        ],
        "caution": "Người thể trạng âm hư hỏa vượng (trong người hay nóng trong, háo khát, táo bón) không nên uống trà sả quá đậm đặc.",
        "safety": "An toàn tuyệt đối làm gia vị ẩm thực; không uống tinh dầu sả nguyên chất chưa pha loãng."
    },
    "malabar-spinach": {
        "usage": "Chứa nhiều chất nhầy (mucilage), vitamin A, C, sắt và canxi; vị ngọt chua tính hàn quy kinh Tâm Tỳ Can Đại trường. Tác dụng thanh nhiệt giải độc, nhuận tràng thông tiện, làm mát huyết và lợi sữa.",
        "identification": "Dây leo thân mập nhớt mọng nước màu xanh lục hoặc tím đỏ. Lá đơn mọc so le dày mọng nước hình tim tròn nhẵn bóng. Quả mọng hình cầu nhỏ khi chín chuyển sang màu đen tím tiết nước nhuộm màu tím biếc.",
        "parts": "Lá và ngọn non tươi (Herba Basellae albae).",
        "habitat": "Cây rau ăn lá quen thuộc trồng leo bờ rào khắp nông thôn nhiệt đới.",
        "preparation": "Nhặt lá và ngọn non rửa sạch, nấu canh ăn chín thanh mát; giã tươi đắp vết bỏng rát.",
        "remedies": [
            "Chữa táo bón, thanh nhiệt mùa hè: Lá mồng tơi non nấu canh với cua đồng hoặc tôm ăn thanh mát giúp nhuận tràng nhanh chóng.",
            "Lợi sữa cho sản phụ: Mồng tơi nấu canh với thịt nạc hoặc móng giò ăn nóng.",
            "Làm dịu vết bỏng nhiệt nhẹ: Lá mồng tơi tươi rửa sạch giã nát vắt lấy nước cốt thoa lên chỗ bỏng rát."
        ],
        "caution": "Người có tỳ vị hư hàn, thường xuyên đi ngoài phân lỏng, đau bụng lạnh không nên ăn canh mồng tơi quá nhiều.",
        "safety": "Rửa sạch từng lá trước khi nấu; dùng an toàn làm rau ăn hàng ngày."
    },
    "marigold": {
        "usage": "Cánh hoa chứa hàm lượng cao Lutein và Zeaxanthin - hai chất chống oxy hóa nhóm carotenoid đóng vai trò bảo vệ hoàng điểm mắt, lọc ánh sáng xanh; có tác dụng kháng viêm tiêu thũng và giảm đau.",
        "identification": "Cây thân thảo hàng năm cao 40-80cm, phân cành nhiều. Lá kép lông chim mép có răng cưa nhỏ, có tuyến tinh dầu mùi thơm hắc đặc trưng. Cụm hoa đầu lớn hình cầu màu vàng tươi hoặc cam đậm, nhiều cánh hoa uốn lượn.",
        "parts": "Cụm hoa tươi hoặc phơi khô (Flos Tagetes erectae).",
        "habitat": "Trồng làm cây hoa cảnh ngày Tết và trồng thâm canh thu hoạch hoa làm nguyên liệu chiết xuất lutein.",
        "preparation": "Thu hái hoa sạch phơi khô hãm nước súc miệng hoặc chiết xuất lutein công nghiệp.",
        "remedies": [
            "Chiết xuất Lutein sáng mắt: Dùng các chế phẩm bổ mắt chiết xuất từ hoa vạn thọ theo tư vấn y dược để phòng thoái hóa điểm vàng.",
            "Giảm đau răng, viêm lợi: Nước hãm hoa vạn thọ ngậm súc miệng giúp giảm sưng đau nướu răng.",
            "Giảm ho gà, viêm phế quản: Hoa vạn thọ khô 10g chưng cách thủy với mật ong ngậm nuốt từ từ."
        ],
        "caution": "Không sử dụng hoa vạn thọ mua từ chợ hoa cảnh để pha trà vì có thể bị phun lượng lớn hóa chất kích thích tăng trưởng.",
        "safety": "Người có cơ địa dị ứng phấn hoa họ Cúc (Asteraceae) cần thận trọng."
    },
    "mint": {
        "usage": "Lá chứa 1–2% tinh dầu với hoạt chất chính là Menthol (50–70%) và Menthone; vị cay the tính mát quy kinh Phế Can. Tác dụng sơ phong thanh nhiệt (trị cảm mạo phong nhiệt), thông mũi họng, tiêu đờm, kích thích tiêu hóa và làm mát da.",
        "identification": "Cây thân thảo sống dai, thân vuông màu xanh hoặc tím, bò lan dưới đất và đâm cành đứng cao 20-40cm. Lá mọc đối hình trứng mép có răng cưa nhọn, phiến lá có nhiều tuyến tinh dầu tỏa mùi the mát sảng khoái đặc trưng.",
        "parts": "Lá và ngọn non tươi hoặc khô (Herba Menthae piperitae).",
        "habitat": "Ưa nơi đất mùn ẩm mát, được trồng làm rau thơm và dược liệu khắp các vùng miền.",
        "preparation": "Hái lá tươi rửa sạch ăn sống, hãm trà với nước sôi 85°C hoặc cất tinh dầu bạc hà.",
        "remedies": [
            "Chữa cảm cúm, sốt nóng, nghẹt mũi đau đầu: Hái một nắm lá bạc hà tươi (15-20g) rửa sạch hãm với nước sôi uống ấm hoặc đun xông mũi họng.",
            "Kích thích tiêu hóa, giảm trướng bụng đầy hơi: Uống 1 tách trà lá bạc hà sau bữa ăn giúp giảm co thắt dạ dày.",
            "Khử mùi hôi miệng, thanh lọc vòm họng: Nhai trực tiếp 2-3 lá bạc hà tươi hoặc súc miệng bằng nước lá bạc hà."
        ],
        "caution": "TUYỆT ĐỐI KHÔNG dùng tinh dầu bạc hà nguyên chất hoặc bôi dầu gió chứa menthol vào mũi, miệng trẻ sơ sinh vì có thể gây ức chế hô hấp ngừng thở đột ngột.",
        "safety": "Người suy nhược cơ thể, gầy yếu, đang vã mồ hôi nhiều không nên uống trà bạc hà đậm đặc."
    },
    "nelavembu": {
        "usage": "Toàn cây chứa hoạt chất đắng Andrographolide và các diterpenoid lactone; vị cực đắng, tính hàn quy kinh Phế Vị Can Đại trường. Được mệnh danh là 'Kháng sinh thực vật' tự nhiên: thanh nhiệt giải độc, tiêu thũng chỉ thống, hạ sốt, ức chế virus đường hô hấp và kháng viêm mạnh mẽ.",
        "identification": "Cây thân thảo nhỏ mọc thẳng đứng cao 30-80cm, thân vuông 4 cạnh phân nhiều cành ngang. Lá đơn mọc đối hình mũi mác phiến mỏng nhẵn bóng. Cụm hoa chùm ở nách lá và đầu cành hoa nhỏ màu trắng có đốm tím hồng.",
        "parts": "Phần trên mặt đất phơi khô (Herba Andrographitis paniculatae).",
        "habitat": "Phân bố rộng ở Ấn Độ và các nước Đông Nam Á; trồng làm vị thuốc quý ở Việt Nam.",
        "preparation": "Thu hái khi cây bắt đầu nở hoa, cắt đoạn phơi khô trong bóng râm, sắc nước uống.",
        "remedies": [
            "Hỗ trợ điều trị viêm họng, viêm amidan, ho sốt: Dùng 10-15g xuyên tâm liên khô sắc nước uống chia 2-3 lần trong ngày.",
            "Chữa viêm ruột, tiêu chảy cấp, lỵ trực trùng: Xuyên tâm liên 15g, kim ngân hoa 10g sắc nước uống.",
            "Rửa vết thương lở loét ngoài da: Đun nước xuyên tâm liên đặc rửa vùng da viêm loét sát khuẩn."
        ],
        "caution": "Vị thuốc có tính đại hàn, không dùng liên tục quá 2 tuần; người tỳ vị hư hàn, tiêu chảy mãn tính không dùng.",
        "safety": "Phụ nữ mang thai tuyệt đối không dùng vì có thể gây sảy thai hoặc ức chế rụng trứng."
    },
    "nooni": {
        "usage": "Quả chứa proxeronine, xeronine, scopoletin, anthraquinone và nhiều chất chống oxy hóa; vị cay nồng hơi nồng gắt tính bình. Tác dụng hoạt huyết thông kinh, nhuận tràng lợi tiểu, giảm đau nhức xương khớp và hỗ trợ điều hòa huyết áp.",
        "identification": "Cây bụi hoặc thân gỗ nhỏ cao 4-8m cành to 4 cạnh. Lá mọc đối hình bầu dục lớn xanh bóng láng dài 15-30cm. Quả hạch kép hình trứng xù xì nhiều mắt quả nhỏ, khi chín đổi từ màu xanh sang trắng ngà mọng nước tỏa mùi khai nồng đặc trưng.",
        "parts": "Quả chín, rễ nhàu và lá (Fructus & Radix Morindae citrifoliae).",
        "habitat": "Mọc hoang nhiều ở vùng ẩm ướt ven sông rạch Nam Bộ và các tỉnh Tây Nguyên.",
        "preparation": "Quả chín ngâm rượu hoặc xắt lát phơi khô sao vàng sắc nước; quả chín ăn với muối.",
        "remedies": [
            "Chữa đau nhức xương khớp, phong thấp, đau lưng mỏi gối: Quả nhàu chín ngâm rượu gạo hoặc xắt lát phơi khô sao vàng sắc nước uống hàng ngày.",
            "Hỗ trợ hạ huyết áp, an thần dễ ngủ: Rễ nhàu phơi khô 30g sắc nước uống thay trà.",
            "Nhuận tràng, giải nhiệt: Ăn quả nhàu chín chấm muối hoặc uống nước cốt nhàu lên men."
        ],
        "caution": "Quả nhàu chứa hàm lượng Kali cao, người mắc bệnh suy thận mạn tính hoặc đang dùng thuốc giữ kali cần tránh dùng.",
        "safety": "Không uống rượu nhàu quá liều lượng chỉ định; phụ nữ có thai nên thận trọng."
    },
    "onion": {
        "usage": "Củ chứa tinh dầu giàu allicin, allyl propyl disulfide và flavonoid quercetin; vị cay ngọt tính ấm quy kinh Phế Tỳ. Tác dụng kháng khuẩn đường hô hấp, làm loãng đờm, hạ lipid máu, chống kết tập tiểu cầu và phòng ngừa xơ vữa động mạch.",
        "identification": "Cây thân thảo sống 2 năm mang thân hành (củ) phình to hình cầu hoặc dẹt nhiều lớp vảy mọng nước màu trắng hoặc tím đỏ. Lá hình ống rỗng tròn màu xanh lục. Cụm hoa hình tán tròn ở đầu một cán hoa rỗng.",
        "parts": "Thân hành (Củ hành tây - Bulbus Allii cepae).",
        "habitat": "Cây rau gia vị và củ thực phẩm nông nghiệp trồng rộng khắp các vùng ôn đới và nhiệt đới.",
        "preparation": "Bóc lớp vỏ khô bên ngoài, rửa sạch củ; dùng tươi xào nấu hoặc hấp cách thủy với đường phèn.",
        "remedies": [
            "Giảm nghẹt mũi, cảm lạnh, ho đờm: Củ hành tây thái mỏng hấp cách thủy với đường phèn uống nước cốt làm ấm cổ họng.",
            "Hỗ trợ giảm mỡ máu, bảo vệ tim mạch: Dùng hành tây tươi trộn dầu giấm ăn trong bữa cơm hàng ngày.",
            "Làm dịu vết côn trùng đốt: Cắt lát hành tây tươi chà nhẹ lên vết muỗi, kiến cắn giúp giảm sưng ngứa."
        ],
        "caution": "Ăn quá nhiều hành sống lúc đói có thể gây ợ nóng, đầy hơi và kích thích niêm mạc dạ dày.",
        "safety": "Rất an toàn và bổ dưỡng trong chế độ ẩm thực hàng ngày."
    },
    "pepper": {
        "usage": "Quả chứa 5–9% piperine và tinh dầu thơm; vị cay nóng tính đại nhiệt quy kinh Tỳ Vị Phế. Tác dụng ôn trung tán hàn (làm ấm tỳ vị, trục hàn khí), chỉ thống, tăng hấp thu dưỡng chất (như curcumin) và kích thích tiêu hóa dịch vị.",
        "identification": "Cây dây leo thân gỗ leo bám nhờ rễ móc ở các mấu cành. Lá đơn mọc so le hình bầu dục hay tim nhọn đầu lá, mặt trên xanh đậm bóng. Cụm hoa hình bông dài buông thõng mang 20-30 quả mọng nhỏ hình cầu, khi chín chuyển sang màu đỏ rồi đen khi phơi khô.",
        "parts": "Quả gần chín phơi khô (Hồ tiêu đen / tiêu sọ - Fructus Piperis nigri).",
        "habitat": "Trồng trọt quy mô lớn làm nông sản xuất khẩu tại Tây Nguyên và Đông Nam Bộ (Phú Quốc, Bình Phước, Đắk Lắk).",
        "preparation": "Hạt tiêu khô xay mịn dùng làm gia vị hoặc ngâm rượu xoa bóp.",
        "remedies": [
            "Chữa đau bụng tiêu chảy do lạnh bụng, nôn mửa thức ăn: Tiêu đen 2-4g tán bột mịn hòa với nước cháo ấm uống.",
            "Tăng khả năng hấp thu Curcumin: Dùng 1 nhúm nhỏ hạt tiêu đen cùng tinh bột nghệ giúp tăng sinh khả dụng của nghệ lên gấp 20 lần.",
            "Ấm khớp, giảm đau lạnh cơ xương: Tiêu ngâm rượu trắng dùng xoa bóp ngoài da."
        ],
        "caution": "Vị cay đại nhiệt, cấm dùng cho người có chứng âm hư nội nhiệt, viêm loét dạ dày tá tràng thể nóng hoặc trĩ chảy máu.",
        "safety": "Dùng lượng vừa phải làm gia vị hàng ngày; tránh hít trực tiếp bột tiêu gây kích ứng niêm mạc mũi."
    },
    "rose": {
        "usage": "Cánh hoa chứa tinh dầu thơm quý (geraniol, citronellol), flavonoid và vitamin C; vị ngọt hơi đắng tính ấm quy kinh Can Tỳ. Tác dụng hành khí giải uất (giảm lo âu u uất), hoạt huyết chỉ thống, thanh nhiệt dưỡng nhan và làm dịu niêm mạc họng.",
        "identification": "Cây bụi đứng hoặc leo, thân cành có nhiều gai nhọn cong. Lá kép lông chim mọc so le có 3-5 lá chét mép khía răng cưa. Hoa đơn hoặc chùm nở ở đầu cành với nhiều cánh hoa xếp đan xen, mùi thơm thanh nhã quyến rũ.",
        "parts": "Nụ hoa mới chớm nở phơi khô (Flos Rosae chinensis).",
        "habitat": "Cây hoa cảnh truyền thống trồng khắp các vùng khí hậu Việt Nam.",
        "preparation": "Hái nụ hoa sáng sớm sấy khô hãm trà hoặc hấp cách thủy cánh hoa tươi với đường phèn.",
        "remedies": [
            "Trà hoa hồng dưỡng nhan, giảm căng thẳng stress: 5-7 nụ hoa hồng sấy khô hãm với nước sôi 85°C uống nhâm nhi thư giãn mỗi tối.",
            "Giảm ho, viêm họng ở trẻ em: Cánh hoa hồng tươi hấp cách thủy với đường phèn hoặc mật ong cho trẻ uống từng thìa nhỏ.",
            "Hỗ trợ giảm đau bụng kinh: Nụ hoa hồng 10g hãm nước sôi cùng 3 lát gừng uống ấm trước kỳ kinh."
        ],
        "caution": "Không dùng các loại hoa hồng cắt cành mua từ tiệm hoa tươi thương phẩm để làm trà vì nguy cơ tồn dư hóa chất cắm hoa và thuốc bảo vệ thực vật.",
        "safety": "Chỉ dùng nụ hoa hồng trồng theo chuẩn hữu cơ sạch để làm dược liệu."
    },
    "snakeplant": {
        "usage": "Lá chứa saponin steroid có tác dụng kháng khuẩn, chống nấm và tiêu viêm nhẹ; thường được dùng trong kinh nghiệm dân gian để làm sạch mụn nhọt, viêm tai giữa nhẹ hoặc thanh lọc độc tố không khí trong nhà.",
        "identification": "Cây thân thảo mọng nước sống lâu năm không có thân trên mặt đất. Lá mọc thẳng đứng từ gốc hình dải giáo dày cứng mọng nước dài 30-80cm, phiến lá có các vằn ngang màu xanh đậm nhạt xen kẽ, viền lá thường có dải vàng kim bóng đẹp.",
        "parts": "Lá tươi dùng ngoài da.",
        "habitat": "Cây cảnh phong thủy thanh lọc không khí trong nhà cực kỳ phổ biến tại các hộ gia đình và văn phòng.",
        "preparation": "Rửa sạch lá tươi, hơ lửa ấm ép lấy dịch hoặc giã nát đắp ngoài.",
        "remedies": [
            "Cây cảnh thanh lọc không khí: Đặt cây lưỡi hổ trong phòng ngủ và bàn làm việc giúp hấp thu các hợp chất hữu cơ bay hơi (VOCs) như formaldehyde, benzen.",
            "Kinh nghiệm dân gian chữa viêm tai nhẹ: Lá lưỡi hổ non hơ nóng ép lấy vài giọt nước cốt nhỏ vào tai giảm đau nhức sưng viêm."
        ],
        "caution": "Lá cây chứa saponin có thể gây kích ứng sưng niêm mạc miệng, nôn nao nếu nhai nuốt sống; tuyệt đối để xa tầm với của chó mèo và thú cưng.",
        "safety": "Chủ yếu dùng làm cây cảnh thanh lọc không gian sống; không tự ý giã uống sống."
    }
};

if (window.HerbaPediaHerbs && Array.isArray(window.HerbaPediaHerbs)) {
    window.HerbaPediaHerbs.forEach(herb => {
        if (OFFICIAL_26_HERBS_DATA[herb.id]) {
            const d = OFFICIAL_26_HERBS_DATA[herb.id];
            herb.usage = d.usage;
            herb.identification = d.identification;
            herb.parts = d.parts;
            herb.habitat = d.habitat;
            herb.preparation = d.preparation;
            herb.remedies = d.remedies;
            herb.caution = d.caution;
            herb.safety = d.safety;
            herb.usageDetails = [
                `Đặc điểm dược tính: ${d.usage}`,
                `Cách chế biến & dùng: ${d.preparation}`,
                `Lưu ý & an toàn: ${d.caution}`
            ];
        }
    });
}


// === CẬP NHẬT ẢNH CHUYÊN BIỆT VỀ 1 CHIẾC LÁ ĐƠN LẺ CHO TỪ ĐIỂN TRA CỨU ===
const ISOLATED_LEAF_IMAGES = {
    "guava": "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80",
    "mango": "https://images.unsplash.com/photo-1628155930542-3c7a64e2c848?auto=format&fit=crop&w=800&q=80",
    "jackfruit": "assets/images/jackfruit.jpg",
    "papaya": "assets/images/papaya.jpg",
    "neem": "assets/images/Neem.jpg",
    "aloevera": "assets/images/nhadam.jpg",
    "coffee": "assets/images/coffe.jpg",
    "mint": "assets/images/Bacha.jpg",
    "betel": "assets/images/Betel.jpg",
    "lemon": "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80",
    "orange": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
    "tea": "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&w=800&q=80",
    "centella-asiatica": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
    "bitter-gourd": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    "grape": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    "tomato": "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80",
    "hibiscus": "https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=800&q=80",
    "tulsi": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
};

if (window.HerbaPediaHerbs && Array.isArray(window.HerbaPediaHerbs)) {
    window.HerbaPediaHerbs.forEach(herb => {
        if (ISOLATED_LEAF_IMAGES[herb.id]) {
            herb.image = ISOLATED_LEAF_IMAGES[herb.id];
        }
    });
}
