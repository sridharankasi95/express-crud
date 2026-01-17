---

# 🚀 Node.js (Express) Deployment Guide (AWS EC2 + MongoDB Atlas)

---

## 📌 1. EC2 Instance Setup

### OS

* Amazon Linux 2023 / Amazon Linux 2

### Security Group (IMPORTANT)

Open these ports:

| Type       | Port | Source                         |
| ---------- | ---- | ------------------------------ |
| SSH        | 22   | Your IP                        |
| HTTP       | 80   | 0.0.0.0/0                      |
| HTTPS      | 443  | 0.0.0.0/0                      |
| Custom TCP | 5000 | 127.0.0.1 (optional, internal) |

---

## 📌 2. Connect to EC2

```bash
ssh -i your-key.pem ec2-user@EC2_PUBLIC_IP
```

---

## 📌 3. Update System

```bash
sudo dnf update -y
```

---

## 📌 4. Install Node.js (LTS)

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install nodejs -y
node -v
npm -v
```

---

## 📌 5. Install Git

```bash
sudo dnf install git -y
git --version
```

---

## 📌 6. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 --version
```

---

## 📌 7. Clone Project

```bash
cd /home/ec2-user
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

---

## 📌 8. Environment Variables (.env)

```bash
nano .env
```

### Example `.env`

```env
PORT=5000
NODE_ENV=production

MONGO_URI=mongodb+srv://username:password@cluster0.xxxx.mongodb.net/mydb

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=app_password
```

Save → `CTRL + O` → `CTRL + X`

---

## 📌 9. Test Server (Temporary)

```bash
node src/server.js
```

If working → `CTRL + C`

---

## 📌 10. Run App Using PM2

```bash
pm2 start src/server.js --name express-crud
pm2 save
pm2 startup systemd
```

👉 Copy & run the command PM2 shows.

Check status:

```bash
pm2 list
```

---

## 📌 11. Install Nginx

```bash
sudo dnf install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

Test:

```bash
curl http://localhost
```

---

## 📌 12. Configure Nginx Reverse Proxy

### Create config file

```bash
sudo nano /etc/nginx/conf.d/express-crud.conf
```

### Nginx Config

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📌 13. Test & Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Test:

```bash
curl http://yourdomain.com/api/users
```

---

## 📌 14. DNS Configuration (IMPORTANT)

In your **Domain Provider**:

| Type | Name | Value         |
| ---- | ---- | ------------- |
| A    | @    | EC2_PUBLIC_IP |
| A    | www  | EC2_PUBLIC_IP |

Wait **5–10 minutes**

---

## 📌 15. Install Certbot (HTTPS)

```bash
sudo dnf install certbot python3-certbot-nginx -y
```

---

## 📌 16. Enable HTTPS (SSL)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Choose:

* Redirect HTTP → HTTPS → **YES**

---

## 📌 17. Auto Renew SSL

```bash
sudo certbot renew --dry-run
```

---

## 📌 18. Final Test

```bash
https://yourdomain.com/api/users
```

✔ HTTPS
✔ Node.js via PM2
✔ MongoDB Atlas
✔ Nginx Reverse Proxy

---

## 📌 19. Useful Commands

```bash
pm2 restart express-crud
pm2 logs
pm2 stop express-crud
sudo systemctl restart nginx
```

---

## 📌 20. Common Errors & Fix

### ❌ Cannot connect to MongoDB

✔ Check `.env`
✔ Check Atlas IP Whitelist (`0.0.0.0/0`)

### ❌ Certbot timeout

✔ Open ports **80 & 443**
✔ DNS must point to EC2 IP

### ❌ Request timeout in Postman

✔ Nginx proxy config
✔ PM2 app running

---

## 🎯 What You Learned

* Production Node.js deployment
* PM2 process management
* Nginx reverse proxy
* HTTPS with Let’s Encrypt
* MongoDB Atlas
* AWS EC2 production setup

---

### 🔥 Next Advanced Topics (Optional)

* Docker + Docker Compose
* CI/CD (GitHub Actions)
* AWS Load Balancer
* Auto Scaling
* CloudWatch Logs

---
