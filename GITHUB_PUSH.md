# Projeyi GitHub'a Yükleme

Repo yerelde hazır. Aşağıdakileri yapın:

## 1. GitHub'da yeni repo oluşturma

1. [github.com](https://github.com) → giriş yapın.
2. Sağ üst **+** → **New repository**.
3. **Repository name:** `karar-carki` (veya istediğiniz isim).
4. **Public** seçin.
5. **"Add a README file"** veya **".gitignore"** eklemeyin (zaten projede var).
6. **Create repository** tıklayın.

## 2. Yerel projeyi GitHub'a bağlama ve gönderme

GitHub sayfasında repo oluşturduktan sonra gösterilen komutları kullanın. **"…or push an existing repository from the command line"** bölümündekiler:

```bash
cd c:\Users\ts\Downloads\karar-carki

git remote add origin https://github.com/KULLANICI_ADINIZ/karar-carki.git

git branch -M main
git push -u origin main
```

- `KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı yazın.
- Repo adını değiştirdiyseniz `karar-carki` kısmını da ona göre güncelleyin.
- İlk `git push` sırasında GitHub girişi (tarayıcı veya token) istenebilir.

Bu adımlardan sonra proje GitHub’da görünür ve Vercel bu repoyu bağlayabilirsiniz.
