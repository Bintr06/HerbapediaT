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


const MEDICAL_UPDATES = {
    "aloevera": {
        "tags": [
            "thanh nhiệt",
            "nhuận tràng",
            "liền sẹo",
            "kháng khuẩn"
        ],
        "parts": "Thịt lá (gel), chất nhựa vàng (aloin phơi khô làm vị thuốc lô hội).",
        "usage": "Thanh nhiệt gián hỏa, nhuận tràng thông tiện (liều nhỏ kích thích tiêu hóa, liều cao gây tẩy xổ). Dùng ngoài làm mát dịu bỏng nhiệt, dưỡng ẩm, kháng viêm và kích thích tái tạo biểu mô.",
        "identification": "Cây thân thảo sống lâu năm, lá mọng nước hình mũi mác dày, mọc sát gốc xếp thành hoa thị, mép lá có gai nhọn cứng rải rác.",
        "habitat": "Nguồn gốc Bắc Phi, thích nghi khí hậu khô nóng nhiều nắng; trồng phổ biến khắp các vườn dược liệu và hộ gia đình.",
        "remedies": [
            "Chữa bỏng nhiệt độ nhẹ: Dùng gel thịt lá nha đam tươi đã ngâm rửa sạch mủ vàng, gọt vỏ rồi đắp nhẹ trực tiếp lên vết bỏng giúp hạ nhiệt và giảm phồng rộp.",
            "Thanh nhiệt, giải độc cơ thể: Gel thịt nha đam nấu với đường phèn hoặc đậu xanh, uống mát trong ngày hè.",
            "Hỗ trợ tiêu hóa, trị táo bón: Dùng 10-15g thịt lá nha đam tươi gọt sạch mủ vàng ăn trực tiếp hoặc xay uống."
        ],
        "safety": "Chỉ dùng phần thịt trong suốt sau khi ngâm nước muối rửa trôi mủ vàng aloin. Phụ nữ mang thai, cho con bú và người tiêu chảy tỳ vị hư hàn không dùng đường uống.",
        "preparation": "Cắt cuống lá để đứng 15 phút cho chảy hết dịch nhựa vàng độc hại, gọt sạch vỏ xanh, ngâm rửa phần gel trong nước muối loãng trước khi dùng.",
        "caution": "Nhựa vàng chứa Anthranoid gây co bóp tử cung mạnh và kích ứng niêm mạc ruột non; không thoa gel lên vết thương hở sâu đang nhiễm trùng.",
        "usageDetails": [
            "Dạng dùng: Gel tươi đã sơ chế sạch mủ vàng; nước nấu thanh nhiệt; dùng ngoài thoa dưỡng ẩm.",
            "Cách dùng: Gọt sạch vỏ xanh, ngâm xả nhớt và nhựa vàng kỹ; dùng ngoài thoa nhẹ lên da; dùng trong nấu chín.",
            "Liều dùng: Dùng trong 10-20g thịt lá/ngày. Không tự uống nhựa vàng khô quá liều chỉ định y khoa."
        ]
    },
    "bitter-gourd": {
        "tags": [
            "thanh nhiệt",
            "hạ đường huyết",
            "giải độc",
            "tiêu viêm"
        ],
        "parts": "Quả tươi, lá bánh tẻ, dây và hạt.",
        "usage": "Vị đắng (khổ), tính hàn, quy kinh Tâm Can Tỳ Vị. Thanh nhiệt tả hỏa, giải độc mát gan, sáng mắt (minh mục). Hoạt chất Charantin và polypeptide-p hỗ trợ kiểm soát đường huyết và ức chế virus.",
        "identification": "Dây leo thân mảnh khía rãnh, tua cuốn đơn, lá xẻ thùy chân vịt sâu 5-7 thùy. Quả thon dài hoặc bầu dục có nhiều u lồi sần sùi đặc trưng.",
        "habitat": "Vùng nhiệt đới và cận nhiệt đới; trồng rộng rãi làm thực phẩm thanh mát và dược liệu ở Việt Nam.",
        "remedies": [
            "Hỗ trợ kiểm soát đái tháo đường: Khổ qua tươi 1 quả bỏ ruột ép lấy nước uống mỗi sáng hoặc thái lát phơi khô hãm trà uống hàng ngày.",
            "Chữa rôm sảy, mẩn ngứa ở trẻ: Nấu một nắm lá khổ qua hoặc 2-3 quả khổ qua tươi lấy nước tắm mát.",
            "Thanh nhiệt giải cảm sốt: Khổ qua 1 quả thái mỏng nấu canh với thịt nạc ăn trong ngày."
        ],
        "safety": "Người có tỳ vị hư hàn (dễ lạnh bụng, đi lỏng), người tụt đường huyết và phụ nữ có thai không nên dùng nhiều.",
        "preparation": "Quả rửa sạch, bổ dọc nạo bỏ ruột và hạt trắng. Có thể dùng tươi, nấu chín hoặc thái mỏng phơi khô sao vàng hạ thổ làm trà.",
        "caution": "Vị đắng tính hàn dùng kéo dài có thể gây lạnh bụng; hạt khổ qua chứa vicine có thể gây tán huyết ở người thiếu men G6PD.",
        "usageDetails": [
            "Dạng dùng: Quả tươi ép nước, nấu canh; dây lá đun nước tắm; quả khô hãm trà.",
            "Cách dùng: Hãm trà 10-15g khô/ngày; nấu canh dùng 1 quả tươi 100-200g.",
            "Liều dùng: Dùng đường uống liên tục không quá 3 tuần; cần theo dõi chỉ số đường huyết nếu đang uống thuốc hạ đường."
        ]
    },
    "centella-asiatica": {
        "tags": [
            "thanh nhiệt",
            "giải độc",
            "mát gan",
            "liền sẹo",
            "lợi tiểu"
        ],
        "parts": "Toàn cây trên mặt đất (Herba Centellae).",
        "usage": "Vị đắng nhẹ, tính mát, thanh nhiệt giải độc, lợi niệu tiêu thũng, lương huyết sinh cơ. Hoạt chất asiaticoside kích thích tăng sinh nguyên bào sợi và tổng hợp collagen giúp mau lành tổn thương da.",
        "identification": "Cây thảo mọc bò sát đất, thân mảnh đâm rễ ở các đốt. Lá hình thận hoặc tròn cuống dài, mép có khía tai bèo tròn đều.",
        "habitat": "Ưa nơi ẩm ướt râm mát, mọc hoang dại và được canh tác quy mô lớn khắp các vùng đồng bằng nhiệt đới.",
        "remedies": [
            "Mát gan thanh nhiệt, trị mụn nhọt: 50-100g rau má tươi rửa sạch ngâm muối, giã nát hoặc xay nhuyễn vắt lấy nước cốt uống.",
            "Hỗ trợ lành sẹo, vết trầy xước nhẹ: Rau má tươi giã nát vắt bớt nước, đắp phần bã sạch lên vết thương đã sát khuẩn.",
            "Hạ sốt, viêm họng nhiệt miệng: Rau má 40g, cỏ mực 40g sắc nước uống trong ngày."
        ],
        "safety": "Cây mọc sát mặt đất dễ nhiễm vi sinh và ký sinh trùng nên cần rửa kỹ. Không dùng quá 6 tuần liên tục vì có thể gây ảnh hưởng chức năng gan.",
        "preparation": "Ngâm nước muối loãng, rửa sạch bùn đất rễ. Dùng tươi nguyên chất ép nước hoặc sao vàng nhẹ hãm trà.",
        "caution": "Phụ nữ mang thai không uống nhiều nước rau má vì có thể gây co thắt nhẹ tử cung; người đang uống thuốc an thần cần thận trọng.",
        "usageDetails": [
            "Dạng dùng: Nước ép tươi, nấu canh, hãm trà khô, giã đắp ngoài.",
            "Cách dùng: Rửa thật sạch nhiều lần; uống tươi ngay sau khi xay, không để qua đêm.",
            "Liều dùng: 30 - 50g tươi mỗi ngày (hoặc 15 - 20g khô sắc uống)."
        ]
    },
    "coffee": {
        "tags": [
            "hưng phấn thần kinh",
            "lợi tiểu",
            "chống oxy hóa",
            "kích thích tiêu hóa"
        ],
        "parts": "Hạt nhân phơi khô rang giòn (Semen Coffeae), lá bánh tẻ.",
        "usage": "Caffeine kích thích hệ thần kinh trung ương và vỏ não, tăng tập trung, giảm mệt mỏi, trợ tim nhẹ và kích thích co bóp dạ dày. Axit chlorogenic trong hạt xanh và lá giàu chất chống oxy hóa bảo vệ tế bào.",
        "identification": "Cây thân gỗ nhỏ cao 3-5m, cành ngang tỏa rộng. Lá mọc đối hình bầu dục thon, phiến lá dày láng bóng màu xanh lục thẫm, mép gợn sóng.",
        "habitat": "Trồng trọt quy mô công nghiệp tại các vùng đất đỏ bazan cao nguyên (Tây Nguyên, Nam Mỹ, Châu Phi).",
        "remedies": [
            "Chống mệt mỏi, tăng tỉnh táo: Uống 1 tách cà phê phin (10-15g bột cà phê nguyên chất) vào buổi sáng.",
            "Trà lá cà phê chống oxy hóa: Dùng lá cà phê bánh tẻ phơi khô hãm nước sôi uống như trà xanh giúp hạ đường huyết nhẹ.",
            "Giảm ngộ độc thuốc ức chế thần kinh trung ương: Dùng cà phê đen đậm đặc theo chỉ dẫn sơ cứu y tế."
        ],
        "safety": "Tránh lạm dụng gây bồn chồn, tim đập nhanh, mất ngủ và tăng tiết axit dạ dày. Người cao huyết áp, tim mạch, viêm loét dạ dày cần hạn chế.",
        "preparation": "Hạt sau thu hoạch lên men tách vỏ thịt, phơi khô nhân, rang ở nhiệt độ thích hợp rồi xay mịn.",
        "caution": "Không uống lúc đói cồn cào hoặc sát giờ đi ngủ; phụ nữ có thai chỉ nên dùng dưới 200mg caffeine/ngày.",
        "usageDetails": [
            "Dạng dùng: Bột hạt rang pha nước sôi (phin, máy), chiết xuất hạt cà phê xanh, trà lá cà phê.",
            "Cách dùng: Dùng sau bữa ăn 30-60 phút; hạn chế thêm nhiều đường sữa công nghiệp.",
            "Liều dùng: Tương đương 1-3 tách/ngày (dưới 400mg caffeine cho người trưởng thành khỏe mạnh)."
        ]
    },
    "grape": {
        "tags": [
            "bổ khí huyết",
            "chống lão hóa",
            "bảo vệ tim mạch",
            "mạnh gân cốt"
        ],
        "parts": "Quả chín (nhục quả), hạt nho (Semen Vitis), lá non (lá nho).",
        "usage": "Quả nho bổ khí huyết, kiện tỳ, cường cân cốt, lợi tiểu tiện. Hạt nho chứa Proanthocyanidins (OPCs) và vỏ chứa Resveratrol là những chất chống oxy hóa tự nhiên cực mạnh giúp bền thành mạch máu và hạ cholesterol.",
        "identification": "Dây leo thân gỗ lâu năm bám bằng tua cuốn đối diện cuống lá. Lá to đơn xẻ 3-5 thùy chân vịt mép có răng cưa nhọn.",
        "habitat": "Vùng khí hậu ôn đới và bán khô hạn (Ninh Thuận - Việt Nam, Địa Trung Hải, Mỹ).",
        "remedies": [
            "Bồi bổ cơ thể, suy nhược thần kinh: Nho tươi chín 100-150g ăn hàng ngày hoặc uống nước ép nho tươi.",
            "Chiết xuất hạt nho bảo vệ tim mạch: Dùng các viên tinh chất chuẩn hóa Proanthocyanidins từ hạt nho theo tư vấn dược sĩ.",
            "Hỗ trợ giảm phù nề, tiểu tiện khó: Lá nho tươi 30g rửa sạch đun với 500ml nước uống thay trà trong ngày."
        ],
        "safety": "Quả chín chứa hàm lượng đường fructose tự nhiên cao, người tiểu đường cần định lượng khẩu phần ăn.",
        "preparation": "Ăn tươi cả vỏ sau khi ngâm rửa sạch; hạt nho chiết xuất công nghiệp; lá nho chần nước sôi làm ẩm thực cuốn thịt.",
        "caution": "Vỏ nho ngoài thị trường hay tồn đọng thuốc bảo vệ thực vật, cần ngâm nước ozone hoặc rửa nước muối kỹ.",
        "usageDetails": [
            "Dạng dùng: Quả tươi, nước ép, quả khô (nho khô), cao chiết xuất hạt nho chuẩn hóa.",
            "Cách dùng: Ăn trực tiếp sau bữa ăn; dùng thực phẩm chức năng chiết xuất hạt nho theo nhãn.",
            "Liều dùng: 100-200g quả tươi/ngày."
        ]
    },
    "guava": {
        "tags": [
            "sáp trường chỉ tả",
            "cầm tiêu chảy",
            "kháng khuẩn",
            "hạ đường huyết"
        ],
        "parts": "Búp non, lá bánh tẻ (Folium Psidii), quả xanh và quả chín.",
        "usage": "Vị chát, tính ấm, thu liễm sáp trường (làm săn se niêm mạc ruột), kháng khuẩn chống viêm đường ruột rất mạnh. Quả chín giàu vitamin C và chất xơ hòa tan giúp nhuận tràng nhẹ và tăng miễn dịch.",
        "identification": "Cây thân gỗ nhỏ cao 3-6m, vỏ nhẵn dễ bong thành từng mảng mỏng. Lá mọc đối hình bầu dục thuôn, nổi rõ gân đối xứng ở mặt dưới.",
        "habitat": "Nguồn gốc nhiệt đới Châu Mỹ, mọc tự nhiên và canh tác phổ biến khắp cả nước.",
        "remedies": [
            "Đặc trị tiêu chảy do nhiễm lạnh/vi khuẩn: Búp ổi non 15-20g, gừng tươi nướng cháy 8g, búp chè xanh 10g sắc với 500ml nước còn 200ml chia 2 lần uống ấm.",
            "Trị viêm loét miệng họng, viêm nướu: Lá ổi bánh tẻ 30g đun sôi với 1 lít nước, thêm chút muối hột dùng súc miệng hàng ngày.",
            "Hỗ trợ hạ đường huyết: 15-20g lá ổi khô hãm nước sôi uống thay nước trà sau các bữa ăn chính."
        ],
        "safety": "Lá ổi và búp non có tính thu liễm mạnh, không dùng khi bị táo bón hoặc tiêu chảy do nhiễm trùng lỵ trực trùng cấp kèm sốt cao.",
        "preparation": "Búp ổi và lá hái quanh năm, rửa sạch dùng tươi hoặc phơi khô sao vàng nhẹ để hãm nước.",
        "caution": "Không uống nước lá ổi quá đặc lúc bụng đói vì gây cồn cào và xót ruột.",
        "usageDetails": [
            "Dạng dùng: Nước sắc búp ổi, trà lá ổi khô, nước súc miệng, quả chín ăn tươi.",
            "Cách dùng: Uống ấm khi bụng đau quặn tiêu chảy; hãm trà loãng uống hàng ngày.",
            "Liều dùng: Búp tươi 15-30g/ngày; lá khô 10-15g/ngày."
        ]
    },
    "hibiscus": {
        "tags": [
            "thanh nhiệt",
            "giải độc",
            "tiêu thũng",
            "trị mụn nhọt"
        ],
        "parts": "Hoa dâm bụt tươi, lá non và vỏ rễ.",
        "usage": "Vị ngọt, hơi đắng, tính bình, quy kinh Can Tỳ. Thanh nhiệt giải độc, lương huyết, tiêu thũng bài nùng (làm tan mủ mụn nhọt). Hoa và lá chứa nhiều chất nhầy thực vật làm dịu niêm mạc đường tiêu hóa.",
        "identification": "Cây bụi cao 2-4m. Lá đơn mọc so le hình bầu dục có răng cưa ở nửa trên mép lá. Hoa đơn độc ở nách lá, cánh hoa lớn xòe rộng, nhị dính liền thành cột dài nhô ra ngoài.",
        "habitat": "Trồng rộng rãi làm hàng rào, cây cảnh đô thị và vườn thuốc dân gian khắp các miền khí hậu Việt Nam.",
        "remedies": [
            "Trị mụn nhọt sưng đau, áp xe chưa vỡ mủ: Lá và hoa dâm bụt tươi mỗi thứ một nắm rửa sạch, giã nát với một nhúm muối hạt đắp trực tiếp lên vùng da sưng đỏ.",
            "Hỗ trợ giảm kiết lỵ, đi ngoài ra máu: Hoa dâm bụt đỏ 10 bông rửa sạch, thái nhỏ xào với lòng đỏ trứng gà ăn lúc đói.",
            "Thanh nhiệt lương huyết: Hoa dâm bụt phơi trong bóng râm (âm can) hãm nước sôi uống."
        ],
        "safety": "Cần phân biệt rõ dâm bụt (Hibiscus rosa-sinensis) với Bụp giấm / Atiso đỏ (Hibiscus sabdariffa). Không dùng hoa đã bị phun thuốc trừ sâu cây cảnh.",
        "preparation": "Thu hái hoa khi mới nở sáng sớm, rửa nhẹ tay tránh dập cánh hoa; dùng tươi giã đắp hoặc phơi trong bóng râm.",
        "caution": "Người có thể trạng hư hàn, lạnh bụng, tiêu chảy mạn tính không nên uống nước hoa dâm bụt thường xuyên.",
        "usageDetails": [
            "Dạng dùng: Giã nát đắp ngoài da; hoa tươi xào/sắc nước; hoa khô hãm trà.",
            "Cách dùng: Đắp ngoài lưu 30-45 phút rồi rửa sạch; đường uống hãm nước sôi.",
            "Liều dùng: Hoa tươi 20-30g; lá tươi 30-50g."
        ]
    },
    "jackfruit": {
        "tags": [
            "thanh nhiệt",
            "tiêu viêm",
            "lợi sữa",
            "nhuận phế"
        ],
        "parts": "Lá mít (đặc biệt lá bánh tẻ và lá rụng vàng), quả mít non, hạt mít chín.",
        "usage": "Lá mít vị chát đắng nhẹ, tính bình, có tác dụng tiêu viêm, tiêu thũng, kích thích tăng tiết sữa cho phụ nữ sau sinh. Hạt mít bổ trung ích khí, giàu tinh bột tiêu hóa chậm. Mủ mít dùng ngoài tiêu sưng giảm đau.",
        "identification": "Cây gỗ lớn cao 10-15m. Lá dày dai mọc so le hình bầu dục ngược, mặt trên xanh bóng đậm. Quả to có gai ngắn nhọn, khi bổ có nhiều nhựa mủ trắng dính.",
        "habitat": "Cây ăn quả nhiệt đới bản địa phổ biến ở Việt Nam và Đông Nam Á.",
        "remedies": [
            "Lợi sữa cho sản phụ ít sữa: Lá mít tươi 40g đun sôi kỹ với 500ml nước uống hàng ngày; hoặc quả mít non gọt vỏ thái mỏng nấu canh với móng giò.",
            "Trị mụn nhọt, sưng tấy ngoài da: Dùng lá mít tươi giã nát với chút muối hột đắp lên chỗ sưng đau hoặc bôi nhựa mủ mít tươi trực tiếp lên đầu mụn.",
            "Chữa tiêu chảy phân lỏng: Lá mít khô 20-30g sắc với nước uống trong ngày."
        ],
        "safety": "Múi mít chín ngọt chứa nhiều đường, người có cơ địa nhiệt miệng, bốc hỏa, tiểu đường hoặc mỡ máu cao không nên ăn nhiều.",
        "preparation": "Lá mít hái bánh tẻ rửa sạch, ngâm nước muối khử mủ; hạt mít phải luộc hoặc nướng chín kỹ trước khi ăn.",
        "caution": "Nhựa mủ mít dính dính có thể kích ứng niêm mạc mắt; hạt mít ăn nhiều sống gây đầy hơi khó tiêu.",
        "usageDetails": [
            "Dạng dùng: Nước sắc lá mít, lá mít giã đắp ngoài, quả non nấu canh, hạt chín luộc.",
            "Cách dùng: Sắc nước uống ấm; giã nhuyễn đắp lên vùng da mụn nhọt.",
            "Liều dùng: Lá tươi 30-50g; lá khô 15-20g."
        ]
    },
    "lemon": {
        "tags": [
            "thanh nhiệt",
            "sinh tân chỉ khát",
            "tiêu đờm",
            "sát trùng"
        ],
        "parts": "Dịch quả (nước cốt), vỏ quả (Pericarpium Citri Limon), lá chanh.",
        "usage": "Vị chua thanh, tính bình. Sinh tân dịch giải khát, thanh nhiệt, hóa đờm, chỉ khái. Vỏ chanh vàng giàu tinh dầu limonene và bioflavonoid hỗ trợ tiêu hóa, làm thông thoáng đường hô hấp và kháng khuẩn khoang họng.",
        "identification": "Cây bụi gai nhỏ, lá hình trứng bầu dục mép có răng cưa tù. Quả hình trứng thon hai đầu núm nhọn, khi chín vỏ ngả vàng tươi bóng đẹp chứa nhiều tuyến tinh dầu.",
        "habitat": "Nguồn gốc Nam Á và Địa Trung Hải, hiện được trồng rộng rãi phục vụ ẩm thực và dược liệu.",
        "remedies": [
            "Giảm đau rát họng, ho có đờm: Chanh vàng thái lát mỏng ngâm mật ong nguyên chất, ngậm nhai nuốt nước cốt từ từ 3-4 lần/ngày.",
            "Bù nước, giải nhiệt sau lao động nặng: Nước cốt 1/2 quả chanh vàng pha với 300ml nước ấm, thêm chút muối khoáng và mật ong uống giải khát.",
            "Xông giải cảm sốt nhẹ: Vỏ chanh vàng, lá sả, lá bưởi đun sôi xông toàn thân 10 phút."
        ],
        "safety": "Không uống nước chanh nguyên chất đậm đặc vì axit citric gây mòn men răng và bào mòn niêm mạc dạ dày.",
        "preparation": "Rửa sạch vỏ quả, ngâm nước muối; thái lát ngâm mật ong hoặc vắt lấy nước cốt pha loãng.",
        "caution": "Người đang bị viêm loét dạ dày tá tràng thể trào ngược tăng tiết axit không uống khi đói bụng.",
        "usageDetails": [
            "Dạng dùng: Nước cốt pha loãng, chanh ngâm mật ong/muối, tinh dầu vỏ chanh xông hơi.",
            "Cách dùng: Pha loãng với nước ấm 40°C; uống sau khi ăn no 30 phút.",
            "Liều dùng: 1/2 - 1 quả mỗi ngày."
        ]
    },
    "mango": {
        "tags": [
            "chống oxy hóa",
            "hạ đường huyết",
            "kháng khuẩn",
            "nhuận tràng"
        ],
        "parts": "Lá xoài non/bánh tẻ (Folium Mangiferae), quả chín, vỏ quả và hạt.",
        "usage": "Lá xoài chứa hàm lượng rất cao polyphenol tự nhiên mangiferin - hoạt chất đã được chứng minh có tác dụng chống oxy hóa vượt trội, kháng virus, bảo vệ mạch máu và hỗ trợ điều hòa đường huyết. Quả xoài bổ dưỡng kiện tỳ vị.",
        "identification": "Cây thân gỗ to tán lá xum xuê. Lá đơn mọc so le phiến thon dài nhọn hai đầu, gân lá nổi rõ, khi non có màu tím nâu hoặc xanh non bóng.",
        "habitat": "Cây ăn quả đặc trưng của vùng nhiệt đới gió mùa, trồng phổ biến khắp đất nước.",
        "remedies": [
            "Hỗ trợ giảm đường huyết cho người tiền tiểu đường: Hái 5-7 lá xoài non rửa sạch, ngâm nước sôi để qua đêm, sáng sớm chắt lấy nước uống trước bữa ăn.",
            "Kháng viêm họng, viêm nướu miệng: Lá xoài bánh tẻ một nắm đun sôi với 500ml nước, thêm chút muối dùng súc họng miệng 2-3 lần/ngày.",
            "Bồi bổ tiêu hóa, thanh nhiệt: Ăn quả xoài chín tự nhiên với lượng vừa phải sau bữa ăn."
        ],
        "safety": "Mủ từ cuống lá và vỏ xoài tươi có thể gây bỏng rát viêm da dị ứng. Lá xoài có tác dụng hạ đường huyết nên cần theo dõi khi kết hợp với thuốc tiểu đường.",
        "preparation": "Hái lá non hoặc bánh tẻ không dập nát, rửa sạch trôi hết lớp phấn và mủ cuống, phơi khô trong bóng râm hoặc dùng tươi.",
        "caution": "Không lạm dụng nước lá xoài quá liều có thể gây tụt đường huyết đột ngột; người tiểu đường nặng không ăn nhiều xoài chín ngọt đậm.",
        "usageDetails": [
            "Dạng dùng: Nước hãm lá xoài tươi, trà lá xoài khô, nước súc miệng lá xoài.",
            "Cách dùng: Ngâm hãm nước sôi; súc miệng; uống ấm.",
            "Liều dùng: 5-10 lá non tươi mỗi ngày."
        ]
    },
    "neem": {
        "tags": [
            "sát trùng",
            "kháng nấm",
            "thanh nhiệt giải độc",
            "kháng viêm"
        ],
        "parts": "Lá neem phơi khô (Folium Azadirachtae), dầu hạt neem.",
        "usage": "Vị cực đắng, tính hàn. Trong y học cổ truyền Ấn Độ (Ayurveda), Neem được tôn xưng là 'thần dược trị bệnh'. Có hoạt tính kháng khuẩn phổ rộng, diệt nấm (như Candida, nấm da), chống ký sinh trùng và thanh lọc cơ thể.",
        "identification": "Cây gỗ lớn cao 10-15m. Lá kép lông chim mọc so le, các lá chét hình lưỡi liềm mép khía răng cưa rõ rệt nhọn ở đỉnh.",
        "habitat": "Nguồn gốc Ấn Độ, thích nghi khô hạn, được trồng nhiều ở Ninh Thuận, Bình Thuận và các tỉnh phía Nam.",
        "remedies": [
            "Chữa viêm da cơ địa, vảy nến, nấm ngứa ngoài da: Dùng 100g lá neem tươi đun sôi lấy nước tắm rửa hoặc giã nát lá neem tươi đắp ngoài vùng da nấm ngứa.",
            "Trị gàu, nấm da đầu: Nấu nước lá neem gội đầu và massage chân tóc giúp làm sạch gàu và giảm rụng tóc.",
            "Súc miệng trị viêm nướu, hôi miệng: Lá neem khô 5g hãm với 200ml nước sôi làm nước súc miệng sát khuẩn mỗi sáng."
        ],
        "safety": "Chỉ ưu tiên sử dụng ngoài da (tắm, rửa, bôi, gội). TUYỆT ĐỐI KHÔNG tự ý uống dầu hạt neem hoặc uống nước lá neem liều cao kéo dài vì có độc tính với gan thận.",
        "preparation": "Lá rửa sạch, dùng tươi nấu nước tắm hoặc phơi khô tán bột mịn trộn làm cao đắp ngoài.",
        "caution": "Chống chỉ định đường uống cho trẻ sơ sinh, trẻ nhỏ, phụ nữ mang thai hoặc đang có kế hoạch sinh con (có thể gây sảy thai).",
        "usageDetails": [
            "Dạng dùng: Nước lá tắm rửa ngoài da, nước gội đầu trị nấm, bột lá đắp ngoài, dầu neem bôi ngoài.",
            "Cách dùng: Rửa da, ngâm chân, gội đầu; thử trên vùng da nhỏ trước khi bôi diện rộng.",
            "Liều dùng: Chỉ dùng ngoài da; nếu uống theo đơn chỉ định dược sĩ không quá 2-3g lá khô/ngày."
        ]
    },
    "orange": {
        "tags": [
            "thanh nhiệt",
            "tăng sức đề kháng",
            "lý khí",
            "hóa đờm kiện tỳ"
        ],
        "parts": "Quả chín (dịch quả), vỏ quả cam phơi khô (Trần bì/Chỉ thực - Pericarpium Citri Reticulatae).",
        "usage": "Múi quả ngọt chua tính mát sinh tân chỉ khát, cung cấp vitamin C và flavonoid tăng cường hệ miễn dịch. Vỏ quả cam cay đắng tính ấm (trần bì) có công năng lý khí, hòa vị, kiện tỳ, hóa đờm, trị bụng đầy trướng nấc ợ.",
        "identification": "Cây gỗ nhỏ tán tròn có gai ngắn. Cuống lá có cánh nhỏ hình tim đặc trưng. Quả hình cầu đáy bằng, vỏ có nhiều túi tinh dầu thơm, múi mọng nước.",
        "habitat": "Được trồng phổ biến khắp các miệt vườn từ Bắc chí Nam (Cam sành, cam Xã Đoài, cam Canh, cam Navel).",
        "remedies": [
            "Tăng cường sức đề kháng, giải cảm nắng: Vắt 1-2 quả cam tươi pha với 150ml nước ấm và chút mật ong uống vào ban ngày.",
            "Trị ho có đờm, bụng đầy trướng khó tiêu: Vỏ cam rửa sạch phơi khô 10g hái thái chỉ, gừng tươi 3 lát hãm với nước sôi uống ấm.",
            "Chữa nôn nấc, chán ăn: Vỏ cam khô 12g sắc nước uống khi còn ấm giúp ổn định tỳ vị."
        ],
        "safety": "Không uống nước cam lúc đói bụng vì axit có thể gây xót ruột; tránh uống sát giờ đi ngủ hoặc uống chung ngay sau khi uống sữa tươi.",
        "preparation": "Quả ăn tươi hoặc vắt nước; vỏ quả rửa sạch phơi khô trong bóng râm, sao vàng nhẹ để dành làm vị thuốc trần bì.",
        "caution": "Người đang bị viêm loét dạ dày - tá tràng đang trong đợt cấp không uống nước cam chua đậm đặc.",
        "usageDetails": [
            "Dạng dùng: Nước cam tươi vắt, trà vỏ cam khô (trần bì), mứt vỏ cam giảm ho.",
            "Cách dùng: Uống sau bữa ăn 1-2 giờ; trà vỏ cam hãm nước sôi 90°C.",
            "Liều dùng: 1-2 quả tươi/ngày; vỏ khô 6-12g/ngày."
        ]
    },
    "papaya": {
        "tags": [
            "tiêu thực",
            "nhuận tràng",
            "tiêu viêm",
            "lành vết loét"
        ],
        "parts": "Quả chín, lá đu đủ (Folium Caricae papayae), hạt và hoa đu đủ đực.",
        "usage": "Quả chín ngọt mát bổ dưỡng kiện tỳ nhuận tràng. Nhựa mủ và lá chứa enzyme protease Papain có hoạt tính thủy phân protein cực mạnh, giúp tiêu hóa đạm, chống viêm loét và tiêu mủ hoại tử.",
        "identification": "Cây thân thảo dạng gỗ mềm không phân nhánh mang nhiều vết sẹo cuống lá. Lá to xẻ thùy chân vịt sâu 5-7 thùy cuống rỗng dài vươn rộng.",
        "habitat": "Cây trồng quen thuộc ở mọi miền quê nhiệt đới, dễ sống và cho quả quanh năm.",
        "remedies": [
            "Nhuận tràng, trị táo bón, đẹp da: Ăn 200-300g quả đu đủ chín vàng đều mỗi ngày sau bữa ăn.",
            "Chữa ho dai dẳng, viêm họng: Hoa đu đủ đực tươi 15g (hoặc 10g khô) chưng cách thủy với đường phèn hoặc mật ong, ngậm nuốt nước cốt từ từ.",
            "Hỗ trợ làm mềm thịt, hỗ trợ tiêu hóa kém: Dùng vài giọt nhựa lá/quả đu đủ xanh ướp vào thực phẩm giúp tiêu hóa dễ dàng."
        ],
        "safety": "Phụ nữ mang thai TUYỆT ĐỐI KHÔNG ăn đu đủ xanh hoặc uống nước sắc lá đu đủ đậm đặc vì chất papain và nhựa mủ kích thích co bóp tử cung mạnh gây sảy thai.",
        "preparation": "Quả chín gọt vỏ bỏ hạt; hoa đu đủ đực hái rửa sạch chưng cách thủy; lá đu đủ rửa sạch phơi khô hãm nước.",
        "caution": "Nhựa đu đủ có tính kích ứng niêm mạc rất mạnh, tránh để bắn vào mắt gây tổn thương giác mạc.",
        "usageDetails": [
            "Dạng dùng: Quả chín ăn tươi, hoa đu đủ đực chưng mật ong, trà lá đu đủ khô.",
            "Cách dùng: Ăn trực tiếp quả chín; uống nước hoa chưng ngậm ấm họng.",
            "Liều dùng: Quả chín 100-300g/ngày; hoa đực 10-20g/ngày."
        ]
    },
    "tea": {
        "tags": [
            "thanh nhiệt",
            "chống oxy hóa",
            "kháng khuẩn",
            "lợi tiểu",
            "tỉnh táo"
        ],
        "parts": "Búp non và lá bánh tẻ (Folium Camelliae sinensis).",
        "usage": "Vị chát ngọt đắng nhẹ, tính mát quy kinh Tâm Can Tỳ Phế Thận. Thanh nhiệt chỉ khát, tỉnh thần ích trí, lợi tiểu giải độc tiêu thực. Chứa hàm lượng vượt trội polyphenol thực vật EGCG giúp chống lão hóa, ngăn xơ vữa thành mạch và ức chế vi khuẩn.",
        "identification": "Cây bụi hoặc cây gỗ nhỏ thường xanh. Lá mọc so le hình bầu dục thon, mép có răng cưa nhỏ đều, chất lá dày dai bóng láng.",
        "habitat": "Trồng bạt ngàn tại các vùng đồi núi cao mát mẻ (Thái Nguyên, Lâm Đồng, Sơn La, Phú Thọ).",
        "remedies": [
            "Chống lão hóa, sảng khoái tinh thần: Búp chè xanh tươi một nắm vò dập, tráng qua nước sôi rồi hãm với nước sôi 80-85°C trong 10 phút uống nhâm nhi cả ngày.",
            "Sát khuẩn ngoài da, trị rôm sảy ngứa ngáy: Lá chè xanh tươi 100g đun sôi kỹ với nước và một nhúm muối, pha ấm tắm cho trẻ hoặc rửa vết ngứa.",
            "Khử mùi hôi miệng, phòng sâu răng: Ngậm súc miệng bằng nước chè xanh đặc ấm sau mỗi bữa ăn."
        ],
        "safety": "Không uống nước chè xanh quá đặc khi bụng đói (gây say chè, xót dạ dày); không uống sát giờ đi ngủ vì tanin và cafein gây mất ngủ.",
        "preparation": "Chọn búp lá tươi sạch không hóa chất, rửa kỹ, vò nhẹ cho dập phiến lá rồi hãm với nước nóng (không dùng nước sôi 100°C làm cháy trà).",
        "caution": "Người thiếu máu thiếu sắt nên uống trà cách xa bữa ăn ít nhất 1 giờ vì chất tanin cản trở hấp thu sắt từ thức ăn.",
        "usageDetails": [
            "Dạng dùng: Nước hãm chè tươi, trà khô (trà xanh, trà đen), nước tắm sát khuẩn.",
            "Cách dùng: Hãm nước nóng thưởng trà ban ngày; nấu nước tắm rửa ngoài da.",
            "Liều dùng: Lá tươi 30-50g/ngày; trà khô 5-10g/ngày."
        ]
    },
    "tomato": {
        "tags": [
            "sinh tân chỉ khát",
            "bổ âm dưỡng huyết",
            "chống oxy hóa",
            "bảo vệ tim mạch"
        ],
        "parts": "Quả chín đỏ (Fructus Lycopersici).",
        "usage": "Vị ngọt chua, tính mát. Sinh tân chỉ khát, kiện vị tiêu thực, lương huyết bình can. Hoạt chất Lycopene là chất chống oxy hóa nhóm carotenoid cực mạnh giúp bảo vệ tuyến tiền liệt, bảo vệ màng tim mạch và làm sáng da.",
        "identification": "Cây thân thảo mềm bò hoặc đứng, toàn thân có lông ngắn tiết mùi hăng nhẹ. Lá kép lông chim mép xẻ răng cưa. Quả mọng hình cầu hoặc bầu dục khi chín đổi sang màu đỏ tươi căng mọng.",
        "habitat": "Cây rau quả nông nghiệp trồng khắp các vùng đồng bằng và cao nguyên trên toàn quốc.",
        "remedies": [
            "Bổ sung Lycopene, bảo vệ tim mạch và thị lực: Quả cà chua chín nấu chín với dầu thực vật (chất béo giúp hòa tan và hấp thu Lycopene gấp 3-4 lần so với ăn sống).",
            "Thanh nhiệt giải khát mùa hè: Cà chua chín rửa sạch trần nước sôi lột vỏ, ép lấy nước cốt thêm chút muối uống giải nhiệt.",
            "Hỗ trợ giảm huyết áp, dưỡng da: Nấu canh cà chua đậu phụ thanh đạm ăn trong bữa cơm hàng ngày."
        ],
        "safety": "TUYỆT ĐỐI KHÔNG ăn cà chua xanh còn non, thân lá cà chua vì chứa hàm lượng Solanine độc hại gây ngộ độc đường tiêu hóa.",
        "preparation": "Chỉ dùng quả đã chín đỏ tự nhiên; rửa sạch gọt bỏ hạt nếu dễ bị kích ứng dạ dày.",
        "caution": "Người bị bệnh thận ứ kali hoặc trào ngược thực quản nặng nên ăn lượng vừa phải vì cà chua chứa nhiều axit và kali.",
        "usageDetails": [
            "Dạng dùng: Quả chín ăn tươi, nước ép cà chua chín, nấu chín với dầu ăn trong các món canh xào.",
            "Cách dùng: Nấu chín với dầu mỡ để phát huy tối đa hoạt chất lycopene.",
            "Liều dùng: 1-2 quả chín cỡ vừa mỗi ngày (100-200g)."
        ]
    },
    "tulsi": {
        "tags": [
            "phát hãn giải biểu",
            "kháng khuẩn",
            "giảm ho long đờm",
            "giảm stress"
        ],
        "parts": "Lá, ngọn non mang hoa và toàn cây trên mặt đất (Herba Ocimi tenuiflori).",
        "usage": "Vị cay the, mùi thơm nồng, tính ấm quy kinh Phế Vị. Phát hãn tán hàn (làm ra mồ hôi giải cảm lạnh), hóa thấp trừ đờm, chỉ khái, tiêu viêm. Tinh dầu chứa Eugenol và Caryophyllene giúp kháng khuẩn hô hấp, làm dịu căng thẳng thần kinh và tăng sức bền cơ thể.",
        "identification": "Cây thân thảo sống dai cao 50-80cm, thân vuông có lông mịn màu xanh hoặc tím tía. Lá mọc đối hình trứng mép có răng cưa lượn sóng, vò nát có mùi thơm ngát đinh hương dịu mát.",
        "habitat": "Nguồn gốc Nam Á; trong văn hóa Ấn Độ được tôn kính là 'Thảo mộc Nữ hoàng' (Holy Basil). Trồng phổ biến làm cây thuốc vườn nhà tại Việt Nam.",
        "remedies": [
            "Trị cảm cúm, sốt không ra mồ hôi, đau đầu nghẹt mũi: Dùng 20g lá húng quế thánh, 10g sả, 10g gừng đun sôi xông mặt hoặc sắc nước uống ấm rồi đắp chăn cho toát mồ hôi.",
            "Giảm ho đờm, viêm họng hạt: Hái 10-15 lá tươi rửa sạch, giã nát trộn với 1 thìa mật ong hấp cách thủy uống từ từ làm ấm đường thở.",
            "Thư giãn thần kinh, giảm căng thẳng (Adaptogen): Hãm 5-7 lá Tulsi tươi hoặc khô vào ấm nước sôi uống nhâm nhi như trà thư giãn mỗi tối."
        ],
        "safety": "Phụ nữ có thai và người đang dùng thuốc chống đông máu cần thận trọng vì Tulsi có tác dụng hoạt huyết và làm loãng máu nhẹ.",
        "preparation": "Thu hái lá bánh tẻ và hoa khi cây đang phát triển tươi tốt, rửa sạch dùng tươi hoặc phơi khô trong bóng râm giữ nguyên tinh dầu thơm.",
        "caution": "Không đun nấu nước lá quá lâu trên lửa lớn làm bay hơi mất lượng tinh dầu quý Eugenol.",
        "usageDetails": [
            "Dạng dùng: Trà lá tươi/khô, nước xông cảm cúm, siro hoa lá hấp mật ong, rau thơm.",
            "Cách dùng: Hãm nước sôi 90°C đậy kín nắp 5-10 phút; uống ấm.",
            "Liều dùng: Lá tươi 15-30g/ngày; lá khô hãm trà 5-10g/ngày."
        ]
    }
};

if (window.HerbaPediaHerbs && Array.isArray(window.HerbaPediaHerbs)) {
    window.HerbaPediaHerbs.forEach(herb => {
        if (MEDICAL_UPDATES[herb.id]) {
            Object.assign(herb, MEDICAL_UPDATES[herb.id]);
        }
    });
}
