import sqlite3
import re

# ====== 初始化資料庫 ======
db = sqlite3.connect("user.db")
cur = db.cursor()
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")
db.commit()

# ====== 驗證 Email 格式 ======
def check_email_format(address):
    return re.fullmatch(r"[A-Za-z0-9._%+-]+@gmail\.com", address) is not None

# ====== 驗證密碼規則 ======
def check_password_rule(pwd):
    msg = []
    if len(pwd) < 8:
        msg.append("密碼必須超過8個字元")
    if not re.search(r"[A-Z]", pwd):
        msg.append("需包含大寫英文")
    if not re.search(r"[a-z]", pwd):
        msg.append("需包含小寫英文")
    if not re.search(r"[\W_]", pwd):
        msg.append("需包含特殊字元")

    # 禁止連號
    for i in range(len(pwd) - 2):
        if pwd[i].isdigit() and pwd[i+1].isdigit() and pwd[i+2].isdigit():
            if int(pwd[i+1]) == int(pwd[i]) + 1 and int(pwd[i+2]) == int(pwd[i]) + 2:
                msg.append("不可以連號")
                break
    return msg

# ====== 新用戶註冊 ======
def register_user():
    print("=== 使用者註冊 ===")
    username = input("請輸入名稱：").strip()

    # 驗證 email
    while True:
        mail = input("請輸入Email (需為@gmail.com)：").strip()
        if check_email_format(mail):
            break
        print("⚠️ Email格式不符，請重新輸入")

    # 驗證密碼
    while True:
        passwd = input("請輸入密碼：").strip()
        err = check_password_rule(passwd)
        if not err:
            break
        print("⚠️ " + "、".join(err) + "，請重新輸入")

    print(f"是否儲存 {username} | {mail} | {passwd} (Y/N)?")
    confirm = input(">").strip().upper()
    if confirm != "Y":
        print("返回主畫面")
        return

    # 檢查 email 是否存在
    cur.execute("SELECT * FROM users WHERE email=?", (mail,))
    existing_user = cur.fetchone()

    if existing_user:
        print("⚠️ 此 Email 已存在，是否更新資料？(Y/N)")
        if input(">").strip().upper() == "Y":
            cur.execute("UPDATE users SET name=?, password=? WHERE email=?", (username, passwd, mail))
            print("✅ 已更新資料！")
        else:
            print("返回主畫面")
            return
    else:
        cur.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (username, mail, passwd))
        print("✅ 新用戶已註冊！")

    db.commit()

# ====== 使用者登入 ======
def login_user():
    print("=== 使用者登入 ===")
    uname = input("請輸入名稱：").strip()
    umail = input("請輸入Email：").strip()

    cur.execute("SELECT * FROM users WHERE name=? AND email=?", (uname, umail))
    account = cur.fetchone()

    if not account:
        print("⚠️ 名稱或 Email 錯誤")
        return

    # 密碼驗證
    while True:
        pw_try = input("請輸入密碼：").strip()
        if pw_try == account[3]:
            print(f"🎉 登入成功！歡迎 {account[1]}")
            break
        else:
            print("⚠️ 密碼錯誤，忘記密碼？(Y/N)")
            if input(">").strip().upper() == "Y":
                register_user()
                return
            else:
                print("請重新輸入密碼")

# ====== 主選單 ======
def run_menu():
    while True:
        print("\n(a) 註冊  /  (b) 登入  /  (q) 離開")
        option = input("請選擇：").strip().lower()

        if option == "a":
            register_user()
        elif option == "b":
            login_user()
        elif option == "q":
            print("再見！")
            break
        else:
            print("請輸入 a, b 或 q")

if __name__ == "__main__":
    run_menu()
    db.close()
 

