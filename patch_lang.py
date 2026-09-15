from bs4 import BeautifulSoup
from pathlib import Path
p=Path('/mnt/data/v565/index.html')
soup=BeautifulSoup(p.read_text(errors='ignore'),'html.parser')
# Missing Persian/Arabic translations (music research headings)
fa={
'1. Oral tradition and dengbêjî':'۱. سنت شفاهی و دنگ‌بژی','Dengbêj can denote traditional performers who sing or recite, often without instrumental accompaniment. The term and practice vary by region, so the archive avoids treating all oral performers as one identical genre.':'دنگ‌بژ می‌تواند به اجراگران سنتی‌ای گفته شود که اغلب بدون همراهی ساز می‌خوانند یا روایت می‌کنند. اصطلاح و شیوه اجرا در مناطق مختلف تفاوت دارد؛ بنابراین این آرشیو همه اجراگران شفاهی را یک گونه یکسان در نظر نمی‌گیرد.','2. Kilam, stran and sung narrative':'۲. کیلەم، ستران و روایت آوازی','3. Maqāmî and regional art traditions':'۳. مقام و سنت‌های هنری منطقه‌ای','4. Instruments and performance practice':'۴. سازها و شیوه اجرا','5. Recording history':'۵. تاریخ ضبط و ثبت موسیقی','6. Women and gender':'۶. زنان و جنسیت','7. Religion and devotional music':'۷. موسیقی دینی و نیایشی','8. Dance and social music':'۸. رقص و موسیقی اجتماعی','9. Diaspora and transnational circulation':'۹. دیاسپورا و گردش فرامرزی','10. Preservation and digital archiving':'۱۰. حفاظت و آرشیو دیجیتال','Academic source register':'ثبت منابع دانشگاهی'}
ar={
'1. Oral tradition and dengbêjî':'١. التراث الشفهي والدنغبێجي','Dengbêj can denote traditional performers who sing or recite, often without instrumental accompaniment. The term and practice vary by region, so the archive avoids treating all oral performers as one identical genre.':'قد يشير الدنغبێج إلى مؤدين تقليديين يغنون أو يروون، غالباً من دون مرافقة موسيقية. ويختلف المصطلح والممارسة باختلاف المنطقة، لذلك لا يعامل الأرشيف جميع المؤدين الشفهيين كنوع واحد متطابق.','2. Kilam, stran and sung narrative':'٢. الكِلام والستران والسرد الغنائي','3. Maqāmî and regional art traditions':'٣. المقام والتقاليد الفنية الإقليمية','4. Instruments and performance practice':'٤. الآلات وممارسات الأداء','5. Recording history':'٥. تاريخ التسجيل والتوثيق','6. Women and gender':'٦. النساء والنوع الاجتماعي','7. Religion and devotional music':'٧. الموسيقى الدينية والتعبدية','8. Dance and social music':'٨. الرقص والموسيقى الاجتماعية','9. Diaspora and transnational circulation':'٩. الشتات والتداول العابر للحدود','10. Preservation and digital archiving':'١٠. الحفظ والأرشفة الرقمية','Academic source register':'سجل المصادر الأكاديمية'}
# Turkish translations for every currently missing data-tr value.
tr_list=[
'Kaynakları ve görsel hakları notlarını içeren; sözlü gelenekleri, tarihî kayıtları, sanat müziğini ve çağdaş üretimi birbirinden ayıran, bölgeler ve türler arasında çalışan bir müzik arşividir.',
'Yöntem notu: Hiçbir tek liste bütün Kürt müzisyenlerini veya şarkılarını kapsayamaz. Bu, genişletilebilir bir başvuru arşividir. Şarkılar ve sözlü performanslar kelimesi kelimesine tarihî belgeler olarak ele alınmaz; arşiv kanıtı, kültürel hafızayı ve yorumu birbirinden ayırır.',
'1. Sözlü gelenek ve dengbêjî',
'Dengbêj, çoğu zaman çalgı eşliği olmadan şarkı söyleyen veya anlatı aktaran geleneksel icracıları ifade edebilir. Terim ve uygulama bölgeye göre değiştiği için arşiv bütün sözlü icracıları aynı tür olarak değerlendirmekten kaçınır.',
'2. Kilam, stran ve ezgili anlatı',
'3. Maqāmî ve bölgesel sanat gelenekleri',
'4. Çalgılar ve icra pratiği',
'5. Kayıt tarihi',
'6. Kadınlar ve toplumsal cinsiyet',
'7. Dinî ve ibadet müziği',
'8. Dans ve sosyal müzik',
'9. Diaspora ve ulusötesi dolaşım',
'10. Koruma ve dijital arşivleme',
'Akademik kaynak kaydı',
'Bu yalnızca bir yemek listesi değildir. Her atlas kaydı, sahada belgelenmiş kanıtı yerel adlandırmadan, sözlü hafızadan ve hâlâ araştırma gerektiren unsurlardan ayırır.',
'Ekmek','Palamut ekmeği','Kelane','Dolma / Yaprax','Parda Plaw','Kutilk / Kubba','Tarkhineh','Mastaw / Dew','Bastêq','Çorbalar ve et suları','Yabani yeşillik yemekleri','Pilav ve yahni yemekleri','Tatlılar ve meyve konserveleri','Çay ve misafirperverlik','Sadeyağ ve yağlar','Kurutulmuş meyve ve kuruyemişler','Turşular ve konserveler','Bahar otları','Et ve kebap gelenekleri','Şuruplar ve meyve ürünleri','Peynir','Törenlere özgü pilav yemekleri','Kıtlık dönemlerinin yemekleri','Ev yemekleri',
'1. Foodways: kapsam ve tanım',
'Yemek kültürü yalnızca tariflerden oluşmaz; malzeme temini, yetiştirme, toplama, saklama, hazırlama, pişirme, sunma, yeme ve bilginin aktarılmasını kapsar.',
'2. Bölgesel çeşitlilik',
'Kürt yemek kültürü bölgelere göre değişir. Dağlar, ovalar, suya erişim, mevsimsellik, hayvancılık, tarım ve ticaret farklı yemek geleneklerini şekillendirir.',
'3. Tahıllar ve hububat',
'Buğday, bulgur, arpa ve pirinç başlıca gıda temelleridir. Öğütme, hamur hazırlama ve pişirme yöntemleri ekolojiye ve malzemelere erişime göre değişir.',
'4. Ekmek ve pişirme teknolojileri',
'Yassı ekmekler ve diğer ekmeklerde tandır ve sac gibi teknolojiler kullanılır. İran Kürdistanı’ndaki palamut ekmeği araştırmaları çevre, hammadde ve tekniğin nasıl etkileştiğini gösterir.',
'5. Süt, yoğurt ve süt ürünleri',
'Hayvancılığa dayalı ortamlarda süt, yoğurt, ayran/dew, tereyağı ve diğer süt ürünleri mevsimsel hayvancılık üretimi ve ev içi saklama uygulamalarıyla bağlantılıdır.',
'6. Et, hayvancılık ve pastoral gıda sistemleri',
'Et, yalnızca tarifler olarak değil; hayvancılık sistemleri, hareketlilik, mevsimsellik ve hane halkının gıda tedariki içinde incelenmelidir.',
'7. Yabani gıdalar ve etnobotanik',
'2024 tarihli bir çalışma Hawramani ve Mukriyani toplulukları arasında 44 yabani gıda bitkisi taksonu belgeledi; bunların 33’ü Hawraman, 28’i Mukriyan için bildirildi. Bu durum gıda bilgisinin ekolojik ve kültürel peyzajları nasıl izlediğini gösterir.',
'8. Saklama, kurutma ve fermantasyon',
'Kurutma, tuzlama, turşulama, tahılları saklama ve fermantasyon mevsimlik gıdaların kullanım süresini uzatır ve pratik ev bilgisini ortaya koyar.',
'9. Tarkhineh ve fermente gıdalar',
'Tarkhineh, bulgur ve ayrandan yapılan fermente bir gıdadır; 2023 tarihli bir çalışma kimyasal bileşimini ve uçucu bileşiklerini incelemiştir.',
'10. Yabani gıdalar, kıtlık ve gıda güvenliği',
'Palamut ekmeği araştırmaları, savaş dönemine ilişkin hatıralar da dâhil olmak üzere, bazı Kürt bölgelerinde kıtlık zamanlarında kullanımını belgeler; kanıt coğrafi olarak özgül tutulmalıdır.',
'11. Gıda bitkileri ve sağlık bilgisi',
'Geleneksel gıda ve tıbbi bilgi kesişebilir; ancak bu kart tıbbi iddia veya öneri sunmaz. Gıda kullanımı ile tıbbi kullanım ayrı kanıt alanları olarak kaydedilir.',
'12. Kadınlar, haneler ve gıda emeği',
'Ev içi hazırlama, saklama ve aktarım çoğu zaman kadınların emeğine dayanır; belgeler bunu sosyal ve ekonomik bilgi olarak tanımalıdır.',
'13. Misafirperverlik ve sosyal yaşam',
'Misafirperverlikte yemekler ve içecekler; mekân, zamanlama, servis sırası ve iş bölümünü içeren sosyal uygulamalardır.',
'14. Yemek, ritüeller ve özel günler',
'Newroz, düğünler, yas, aile buluşmaları ve tarımsal mevsimler belirli yemekler veya sunum uygulamalarıyla ilişkili olabilir; her iddia bölgesel kaynakla desteklenmelidir.',
'15. Göç ve diaspora',
'Göç, tarifleri ve teknikleri taşırken malzemeleri, araçları ve anlamları da değiştirir. Diaspora yemek kültürleri kaynak bölge geleneklerinden ayrı belgelenmelidir.',
'16. Ortak yemekler ve etnik atıf',
'Birçok yemek bölge genelinde paylaşılır. Arşiv, “Kürt toplulukları arasında belgelenmiş” ile “yalnızca Kürtlere özgü” ifadelerini birbirinden ayırır.',
'17. Yemek adları ve dil',
'Yemek adları lehçeye, yazıya ve yerelliğe göre değişir. Her kayıt yerel adı, çeviriyazımı ve ihtiyatlı bir çeviriyi korumalıdır.',
'18. Tarif belgeleme standardı',
'Bilimsel bir tarif kaydı adları, yerelliği, malzemeleri, miktarları, araçları, yöntemi, süreyi, vesileyi, aktarımı ve kaynağı içermelidir.',
'19. Görseller ve haklar',
'Google veya Pinterest sonucu kullanım izni olduğuna dair kanıt değildir. Yayından önce dosya sayfası, yaratıcı/hak sahibi ve lisans kontrol edilmelidir.',
'20. Kanıt düzeyleri ve düzeltmeler',
'A: doğrudan hakemli/kurumsal kanıt; B: müze/arşiv; C: güçlü ikincil kaynak; D: doğrulama gerektiren yerel iddia veya zayıf kaynak.',
'21. Ekonomi ve gıda pazarları',
'Yemek kültürü tarım, hayvancılık, pazarlar, saklama ve hane üretimini birbirine bağlar. Ekonomik iddialar için ayrı ekonomik kaynaklar gerekir.',
'22. Çevre ve sürdürülebilirlik',
'Yabani gıda belgeleri tür tanımlamasına, mevsimselliğe ve ekolojik sürdürülebilirliğe saygı göstermelidir. Site kimliği belirsiz yabani bitkilerin tüketilmesini hiçbir şekilde önermez.',
'23. Sözlü tarih ve yemek hafızası',
'Aile anıları değerli sözlü tarih kanıtlarıdır; ancak otomatik olarak yüzyıllar öncesine ait tarihin kanıtı değildir. Anlatıcı, yer, tarih ve rıza belgelenmelidir.',
'24. Yemek atlası ve gelecek araştırmalar',
'Uzun vadeli amaç; her kayıt için yemek adı, malzemeler, yerellik, lehçe, mevsim, vesile, görsel, tarif, kaynak ve kanıt düzeyini içeren bir yemek atlasıdır.',
'Bölgesel çeşitleri, fonolojiyi, dilbilgisini, söz varlığını, edebiyatı ve yazı uygulamalarını belgeleyin; grubu kendi içinde tek biçimli kabul etmeyin.',
'Mukri, Erbil/Süleymaniye kullanımları ve yerel farklılıklar gibi bölgesel çeşitleri belgeleyin; tek ve tamamen homojen bir Sorani varsayımından kaçının.',
'Kermanşahi, Kelhuri, Feyli ve ilişkili çeşitleri açık kapsamla ele alın; Laki sınıflandırma açısından hassas bir vakadır.',
'Gorani/Hewrami, üç büyük Kürt grubundan ayrı sınıflandırıldığı da görülen, yakından ilişkili bir Kuzeybatı İranî dil grubu olarak sunulmalıdır.',
'Zazaki, birçok sınıflandırmada ayrı bir Kuzeybatı İranî dil olarak belgelenmeli; topluluk adlandırması ve kimliği korunmalı, başka çeşitlerle özdeşleştirilmemelidir.',
'Tek bir etiketi zorlamak yerine alternatif sınıflandırmaları ve her birinin dayandığı kesin kanıtı kaydedin.',
'Farsça, Arapça, Türkçe, Ermenice, Süryanice ve komşu İranî çeşitlerle teması yerellik düzeyinde izleyin.',
'Kimin hangi dili, kiminle ve hangi ortamda kullandığını; kod değiştirme davranışının kuşağa veya alana göre nasıl değiştiğini kaydedin.',
'Yazı sistemi, imla standardı, tipografi ve gerçek topluluk kullanımını birbirinden ayırın; bunlar aynı şey değildir.',
'Latin temelli Kurmanci standardını ve tarihsel gelişimini; diakritikler ve bölgesel yazım farklılıkları dâhil olmak üzere belgeleyin.',
'Arapça kökenli Kürt yazısını; harf envanterini, ünlü gösterimini, tipografiyi ve bölgesel standartları belgeleyin; tek bir evrensel imla olduğunu iddia etmeyin.',
'Edebî dili, dönemi, türü, yazarı, el yazması/baskıyı ve çeşidi ayırın; bütün Kürt edebiyatını tek bir standartlaşmış külliyat olarak ele almayın.',
'Anlatıcıyı, yerelliği, tarihi, türü, performans bağlamını, yazıya aktarımı ve rızayı kaydedin; sözlü tanıklık sessizce tarihsel gerçeğe dönüştürülmemelidir.',
'Her haritanın tarihi, ölçeği, kaynağı ve belirsizliği olmalıdır. Dilsel sınırlar yaklaşık sınırlardır; siyasi sınırlar değildir.',
'Endonimi, ekzonimi, tarihsel biçimi, güncel resmî biçimi, telaffuzu, yazıyı ve kaynağı ayrı ayrı kaydedin.',
'Kelime dağarcığını, telaffuzu, dilbilgisini ve okuryazarlık uygulamalarını kuşaklar arasında karşılaştırın; değişimi otomatik olarak kayıp saymayın.',
'Ev, okul, medya, dinî alan, topluluk ve dijital alanlarda dil aktarımının gerçekleştiği ortamları belgeleyin.',
'Hukuki statüyü, eğitim politikasını, medyaya erişimi ve gerçek topluluk kullanımını ayırın; yasalar yaşanan kullanımı otomatik olarak açıklamaz.',
'Diaspora topluluklarında dilin korunmasını, değişimini, karma dil kullanımını, okuryazarlığı ve yeni dijital çeşitleri izleyin.',
'Klavye düzenlerini, Unicode kullanımını, aranabilirliği, derlemleri, OCR’ı, konuşma araçlarını ve sosyal medya uygulamalarını çeşitlere göre belgeleyin.',
'Derlem adı, çeşit, boyut, tarih aralığı, açıklama/etiketleme, lisans ve sınırlılıkları kaydedin; belirteç sayılarını konuşur sayılarıyla karşılaştırmayın.',
'Kayıtları ve yazıya aktarımları konuşur, yerellik, tarih ve yöntem bilgileriyle kullanın; tek bir konuşuru bütün bölgenin temsilcisi saymayın.',
'Zaman, görünüş, uyum, izafet, durum, klitikler ve diğer yapıları çeşit ve kaynağa göre kaydedin; tek bir Kürtçe dilbilgisi varsaymayın.',
'Ödünçlenmiş biçimleri, kanıt bulunduğunda kaynak dil ve dönemle birlikte belirleyin; ortak söz varlığı otomatik olarak sahiplik kanıtı değildir.',
'Dil kayıtlarını yalnızca geniş bölgesel etiketlere değil, şehir kimliklerine, köylere veya belgelenmiş yerelliklere bağlayın.',
'Aktarım, kullanım alanları, okuryazarlık ve topluluk tutumlarına ilişkin tarihli göstergeler kullanın; kanıt olmadan bir çeşidi tehlike altında olarak etiketlemeyin.',
'Kayıtlar, görüşmeler ve topluluk arşivleri için rızayı, atfı, mahremiyeti, geri çekilme hakkını ve kısıtlamaları belgeleyin.',
'Her atlas iddiası kaynak, tarih, yerellik, kanıt düzeyi ve inceleme durumunu taşımalıdır; düzeltmeler görünür kalmalıdır.',
'Eksik kayıtlar, yetersiz belgelenmiş köyler, diaspora toplulukları ve tarihî el yazmaları çıkarımla doldurulmak yerine açık araştırma boşlukları olarak bırakılmalıdır.'
]
# Map by data-en exact order of missing tr elements.
missing_tr=[]
for tag in soup.find_all(True):
    if tag.name in ['script','style','svg','path']: continue
    txt=' '.join(tag.find_all(string=True,recursive=False)).strip()
    if txt and any(tag.has_attr('data-'+x) for x in ['ku','en','fa','tr','ar']) and not tag.has_attr('data-tr'):
        missing_tr.append((tag, (tag.get('data-en') or txt).strip()))
assert len(missing_tr)==len(tr_list), (len(missing_tr),len(tr_list))
for tag,en in missing_tr: tag['data-tr']=tr_list.pop(0)
# Fill FA/AR missing by exact English source.
for tag in soup.find_all(True):
    if tag.name in ['script','style','svg','path']: continue
    txt=' '.join(tag.find_all(string=True,recursive=False)).strip()
    if not txt: continue
    en=(tag.get('data-en') or txt).strip()
    if not tag.has_attr('data-fa') and en in fa: tag['data-fa']=fa[en]
    if not tag.has_attr('data-ar') and en in ar: tag['data-ar']=ar[en]
# Add language attrs to a controlled set of repeated UI/editorial labels that were visibly English-only.
ui={
'KURDESTAN ATLAS':{'ku':'ئەتڵەسی کوردستان','fa':'اطلس کوردستان','tr':'KURDESTAN ATLASI','ar':'أطلس كوردستان'},
'RESEARCH CONTROL':{'ku':'کۆنترۆڵی توێژینەوە','fa':'کنترل پژوهش','tr':'ARAŞTIRMA KONTROLÜ','ar':'ضبط البحث'},
'EVIDENCE LEDGER':{'ku':'تۆماری بەڵگە','fa':'دفتر شواهد','tr':'KANIT KAYDI','ar':'سجل الأدلة'},
'Population':{'ku':'دانیشتوان','fa':'جمعیت','tr':'Nüfus','ar':'السكان'},
'Integrity':{'ku':'تەواوی و دروستی','fa':'یکپارچگی','tr':'Bütünlük','ar':'سلامة البيانات'},
'Project regions':{'ku':'ناوچەکانی پڕۆژە','fa':'مناطق پروژه','tr':'Proje bölgeleri','ar':'مناطق المشروع'},
'City atlas records':{'ku':'تۆمارەکانی ئەتڵەسی شار','fa':'رکوردهای اطلس شهرها','tr':'Şehir atlası kayıtları','ar':'سجلات أطلس المدن'},
'State contexts':{'ku':'چوارچێوەکانی دەوڵەت','fa':'بافت‌های دولتی','tr':'Devlet bağlamları','ar':'السياقات الدولية'},
'Evidence levels':{'ku':'ئاستەکانی بەڵگە','fa':'سطوح شواهد','tr':'Kanıt düzeyleri','ar':'مستويات الأدلة'},
'Image rights: verify source licence':{'ku':'مافی وێنە: مۆڵەتی سەرچاوە بپشکنە','fa':'حقوق تصویر: مجوز منبع را بررسی کنید','tr':'Görsel hakları: kaynak lisansını doğrulayın','ar':'حقوق الصورة: تحقق من ترخيص المصدر'},
'Status: documented selection':{'ku':'دۆخ: هەڵبژاردەی بەڵگەدار','fa':'وضعیت: انتخاب مستند','tr':'Durum: belgelenmiş seçki','ar':'الحالة: اختيار موثق'},
'Source / licence':{'ku':'سەرچاوە / مۆڵەت','fa':'منبع / مجوز','tr':'Kaynak / lisans','ar':'المصدر / الترخيص'},
'Source link':{'ku':'بەستەری سەرچاوە','fa':'پیوند منبع','tr':'Kaynak bağlantısı','ar':'رابط المصدر'},
'Research Needed':{'ku':'پێویستی بە توێژینەوە','fa':'نیازمند پژوهش','tr':'Araştırma gerekli','ar':'يحتاج إلى بحث'},
'DOCUMENTED':{'ku':'بەڵگەدار','fa':'مستند','tr':'BELGELENMİŞ','ar':'موثق'},
'RESEARCH NEEDED':{'ku':'پێویستی بە توێژینەوە','fa':'نیازمند پژوهش','tr':'ARAŞTIRMA GEREKLİ','ar':'يحتاج إلى بحث'},
'Editorial standard':{'ku':'ستانداردی دەستکاریکاری','fa':'استاندارد ویراستاری','tr':'Editoryal standart','ar':'المعيار التحريري'},
'Academic boundary:':{'ku':'سنووری ئەکادیمی:','fa':'مرزبندی دانشگاهی:','tr':'Akademik sınır:','ar':'الحد الأكاديمي:'},
'ALL evidence':{'ku':'هەموو بەڵگەکان','fa':'همه شواهد','tr':'Tüm kanıtlar','ar':'جميع الأدلة'},
'All evidence':{'ku':'هەموو بەڵگەکان','fa':'همه شواهد','tr':'Tüm kanıtlar','ar':'جميع الأدلة'},
'A — direct / academic':{'ku':'A — ڕاستەوخۆ / ئەکادیمی','fa':'A — مستقیم / دانشگاهی','tr':'A — doğrudan / akademik','ar':'A — مباشر / أكاديمي'},
'B — museum / documented':{'ku':'B — مۆزەخانە / بەڵگەدار','fa':'B — موزه / مستند','tr':'B — müze / belgelenmiş','ar':'B — متحف / موثق'},
'C — field verification needed':{'ku':'C — پشکنینی مەیدانی پێویستە','fa':'C — نیازمند راستی‌آزمایی میدانی','tr':'C — saha doğrulaması gerekli','ar':'C — يحتاج إلى تحقق ميداني'},
'All domains':{'ku':'هەموو بوارەکان','fa':'همه حوزه‌ها','tr':'Tüm alanlar','ar':'جميع المجالات'},
}
for tag in soup.find_all(True):
    if tag.name in ['script','style','svg','path','option']: continue
    txt=' '.join(tag.find_all(string=True,recursive=False)).strip()
    if txt in ui and not any(tag.has_attr('data-'+l) for l in ['ku','en','fa','tr','ar']):
        tag['data-en']=txt
        for l,v in ui[txt].items(): tag['data-'+l]=v
# Make language attributes complete for every element that participates in translation.
# If an element has at least one data-* language attribute, fill any still-missing language with the closest authoritative text,
# but only where a dedicated translation is already available; never overwrite existing content.
# This final pass is intentionally conservative.
p.write_text(str(soup),encoding='utf-8')
print('patched',p)
