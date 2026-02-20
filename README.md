# Twitter Block List

X (Twitter) için paylaşılan ortak engelleme listesi. Bu depo yalnızca liste verisini barındırır ve eklentiler tarafından JSON olarak okunur.

## Liste Formatı

Blocklist şu formatta tutulur:

```json
{
  "version": 1,
  "updated": "2026-02-20",
  "accounts": ["bothandle1", "bothandle2"]
}
```

- version: Liste sürüm numarası (değiştiğinde güncelleme tetiklenir)
- updated: Son güncelleme tarihi
- accounts: Engellenecek kullanıcı adları (@ olmadan, küçük harf)

## Kurallar

- accounts alanındaki tüm kullanıcı adları küçük harf olmalıdır
- @ işareti kullanılmaz
- Tekrarları eklemeyin

## Güncelleme Akışı

1. accounts listesine yeni hesapları ekleyin veya çıkarın
2. version değerini 1 artırın
3. updated tarihini güncelleyin

## PR Akışı

1. Repoyu fork'layın ve yeni bir branch açın
2. blocklist.json dosyasını güncelleyin
3. Değişikliği küçük ve hedefe odaklı tutun
4. PR açarken şablondaki kontrol listesini doldurun
5. CODEOWNERS onayı zorunludur
6. Otomatik kontroller (blocklist doğrulama) geçmelidir

## Otomatik PR (Plan)

Chrome eklentisi lokal listeyi dışarı aktarır ve PR sayfasını tarayıcıda açacak bir bağlantı üretir. Kullanıcı son kontrolleri tarayıcıdan yapıp PR'i tamamlar. Bu yaklaşım, eklentide token tutmadan güvenli bir akışı hedefler.

## Kullanım

Bu dosya, Chrome eklentileri veya otomasyon araçları tarafından periyodik olarak çekilebilir. Örnek kullanım için twitter_bot_blocker deposuna bakabilirsiniz.
