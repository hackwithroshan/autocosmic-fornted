# प्रोजेक्ट कॉन्फ़िगरेशन फ़ाइलें

इस फ़ाइल में आपके प्रोजेक्ट के लिए ज़रूरी कॉन्फ़िगरेशन फ़ाइलों का पूरा कोड है। कृपया सुनिश्चित करें कि आप इन फ़ाइलों को सही डायरेक्टरी में बनाते हैं।

---

## 1. `.gitignore` (रूट डायरेक्टरी)

यह फ़ाइल सुनिश्चित करती है कि अनावश्यक फ़ाइलें (जैसे `node_modules` और `.env` सीक्रेट्स) आपके Git रिपॉजिटरी में शामिल न हों। इसे अपने प्रोजेक्ट की मुख्य (रूट) डायरेक्टरी में बनाएँ।

```gitignore
# Dependencies
/node_modules
/frontend/node_modules
/backend/node_modules

# Build artifacts
/dist
/build
/frontend/dist
/backend/dist

# Environment variables
# Ignore all .env files but keep the example files
.env
.env.*
!.env.example

frontend/.env
frontend/.env.*
!frontend/.env.example

backend/.env
backend/.env.*
!backend/.env.example

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# IDE / Editor specific
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## 2. `backend/.env.example`

यह फ़ाइल आपके बैकएंड सर्वर के लिए आवश्यक सभी एनवायरनमेंट वेरिएबल्स को सूचीबद्ध करती है। इसे `/backend` डायरेक्टरी के अंदर बनाएँ। लोकल डेवलपमेंट के लिए, इस फ़ाइल की एक कॉपी बनाएँ, उसका नाम `.env` रखें, और उसमें अपनी वास्तविक सीक्रेट कीज़ भरें।

```env
# Server Configuration
PORT=5000

# The full URL of your frontend.
# For local development, use your Vite dev server URL.
CLIENT_URL=http://localhost:5173
# For production on Render, this will be your static site's URL (e.g., https://zaina-frontend.onrender.com)

# Database (MongoDB Atlas)
# अपने वास्तविक कनेक्शन स्ट्रिंग से बदलें
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

# Authentication (JWT)
# यहाँ एक लम्बा, रैंडम और यूनिक स्ट्रिंग डालें
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY_GOES_HERE"
JWT_EXPIRES_IN="7d"

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID="YOUR_RAZORPAY_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_KEY_SECRET"

# Cloud Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_CLOUD_NAME"
CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"

# Optional: Email Service (for password resets, order confirmations, etc.)
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_SECURE=false
# EMAIL_USER=your_email@example.com
# EMAIL_PASS=your_email_password
```

---

## 3. `frontend/.env.example`

यह फ़ाइल आपके फ्रंटएंड (React ऐप) के लिए आवश्यक एनवायरनमेंट वेरिएबल्स को सूचीबद्ध करती है। इसे `/frontend` डायरेक्टरी के अंदर बनाएँ। लोकल डेवलपमेंट के लिए, इस फ़ाइल की एक कॉपी बनाएँ, उसका नाम `.env` रखें, और उसमें अपने लोकल बैकएंड का URL सेट करें।

```env
# यह वह URL है जिसका उपयोग React फ्रंटएंड API कॉल करने के लिए करेगा।
#
# लोकल डेवलपमेंट के लिए, यह आपके लोकल बैकएंड सर्वर को इंगित करना चाहिए।
VITE_API_URL=http://localhost:5000/api
#
# Render पर प्रोडक्शन डिप्लॉयमेंट के लिए, आप इसे अपने डिप्लॉयड बैकएंड के URL पर सेट करेंगे।
# (उदाहरण: VITE_API_URL=https://zaina-backend.onrender.com/api)
```
