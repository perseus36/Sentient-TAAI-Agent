# Teknik Analiz AI Agent

Bu proje, teknik analiz konularında uzmanlaşmış yapay zeka destekli bir sohbet uygulamasıdır. ChatGPT benzeri bir arayüz tasarımı ile kullanıcıların teknik analiz sorularını yanıtlar.

## Özellikler

- 🤖 OpenAI GPT-4 API entegrasyonu
- 💬 ChatGPT benzeri modern arayüz
- 📊 Teknik analiz odaklı uzman sistem
- 🌐 Türkçe dil desteği
- 📱 Responsive tasarım
- ⚡ Gerçek zamanlı sohbet
- 🔒 Güvenli API kullanımı

## Teknik Detaylar

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 API
- **Icons**: Lucide React
- **Architecture**: App Router (Next.js 13+)

## Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

3. **Tarayıcınızda açın:**
```
http://localhost:3000
```

## Kullanım

1. Uygulama açıldığında karşılama mesajını göreceksiniz
2. Teknik analiz ile ilgili sorunuzu yazın
3. AI agent size detaylı ve eğitici yanıtlar verecek
4. Sohbet geçmişi otomatik olarak saklanır

## Örnek Sorular

- "RSI göstergesi nasıl kullanılır?"
- "Fibonacci seviyeleri nedir?"
- "Trend analizi nasıl yapılır?"
- "MACD göstergesi hakkında bilgi ver"
- "Grafik formasyonları nelerdir?"

## 🔐 Güvenlik

### API Key Güvenliği
- **API anahtarı environment variable olarak saklanmalıdır**
- `.env` dosyası `.gitignore`'da bulunur ve asla commit edilmemelidir
- Production ortamında güvenlik önlemleri alınmalıdır
- Rate limiting uygulanmalıdır

### Environment Variables Kurulumu
1. Proje ana dizininde `.env` dosyası oluşturun
2. OpenAI API anahtarınızı ekleyin:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
3. Dosyayı asla GitHub'a push etmeyin

### Production Güvenliği
- Hosting platformunda environment variables kullanın
- API anahtarlarını client-side kodda göstermeyin
- Güvenli secret management servisleri kullanın

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.

## Uyarı

Bu uygulama sadece eğitim amaçlıdır. Verilen bilgiler yatırım tavsiyesi değildir. Yatırım kararları vermeden önce mutlaka profesyonel finansal danışmanlık alın.

## Destek

Herhangi bir sorun yaşarsanız issue açabilir veya pull request gönderebilirsiniz.
