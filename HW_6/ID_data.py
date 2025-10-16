import sqlite3

# ====== 1. 英文字母對應代碼 ======
CITY_CODE_MAP = {
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17,
    'I': 34, 'J': 18, 'K': 19, 'L': 20, 'M': 21, 'N': 22, 'O': 35, 'P': 23,
    'Q': 24, 'R': 25, 'S': 26, 'T': 27, 'U': 28, 'V': 29, 'W': 32, 'X': 30,
    'Y': 31, 'Z': 33
}

CITY_NAME_MAP = {
    'A': '臺北市', 'B': '臺中市', 'C': '基隆市', 'D': '臺南市', 'E': '高雄市',
    'F': '新北市', 'G': '宜蘭縣', 'H': '桃園市', 'I': '嘉義市', 'J': '新竹縣',
    'K': '苗栗縣', 'L': '台中縣', 'M': '南投縣', 'N': '彰化縣', 'O': '新竹市',
    'P': '雲林縣', 'Q': '嘉義縣', 'R': '台南縣', 'S': '高雄縣', 'T': '屏東縣',
    'U': '花蓮縣', 'V': '台東縣', 'W': '金門縣', 'X': '澎湖縣', 'Y': '陽明山', 'Z': '連江縣'
}

# ====== 2. 驗證身分證 ======
def is_valid_id(id_number):
    id_number = id_number.strip().upper()
    if len(id_number) != 10:
        return False
    first_letter = id_number[0]
    if first_letter not in CITY_CODE_MAP:
        return False
    if not id_number[1:].isdigit():
        return False
    if id_number[1] not in ['1', '2', '8', '9']:
        return False

    city_value = CITY_CODE_MAP[first_letter]
    n1, n2 = divmod(city_value, 10)
    digits = [n1, n2] + [int(x) for x in id_number[1:]]
    weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
    total = sum(a * b for a, b in zip(digits, weights))
    return total % 10 == 0

# ====== 3. 補驗證碼 ======
def complete_check_digit(id_prefix):
    id_prefix = id_prefix.strip().upper()
    if len(id_prefix) != 9:
        return None
    if id_prefix[1] not in ['1', '2', '8', '9']:
        return None
    for i in range(10):
        candidate = id_prefix + str(i)
        if is_valid_id(candidate):
            return candidate
    return None

# ====== 4. 連接資料庫 ======
connection = sqlite3.connect("ID_data.db")
cursor = connection.cursor()

# ====== 5. 讀取資料 ======
cursor.execute("SELECT rowid, ID FROM ID_table")
records = cursor.fetchall()

valid_ids = []
invalid_ids = []

for rowid, id_value in records:
    id_clean = id_value.strip().upper()

    # 補驗證碼
    if len(id_clean) == 9:
        completed_id = complete_check_digit(id_clean)
        if completed_id:
            cursor.execute("UPDATE ID_table SET ID = ? WHERE rowid = ?", (completed_id, rowid))
            valid_ids.append(completed_id)
        else:
            invalid_ids.append(id_value)
    elif len(id_clean) == 10:
        if is_valid_id(id_clean):
            valid_ids.append(id_clean)
        else:
            invalid_ids.append(id_value)
    else:
        invalid_ids.append(id_value)

# ====== 6. 批次刪除不合法 ID ======
if invalid_ids:
    placeholders = ','.join('?' for _ in invalid_ids)
    sql = f"DELETE FROM ID_table WHERE TRIM(ID) IN ({placeholders})"
    cursor.execute(sql, [x.strip() for x in invalid_ids])

# ====== 7. 更新欄位（country / gender / citizenship） ======
cursor.execute("SELECT rowid, ID FROM ID_table")
for rowid, id_value in cursor.fetchall():
    id_clean = id_value.strip().upper()
    city = CITY_NAME_MAP.get(id_clean[0], '未知地區')

    gender_code = id_clean[1]
    if gender_code in ['1', '8']:
        gender_text = '男性'
    elif gender_code in ['2', '9']:
        gender_text = '女性'
    else:
        gender_text = '未知'

    third_code = id_clean[2]
    citizenship_map = {
        '0': '台灣出生之本籍國民',
        '1': '台灣出生之本籍國民',
        '2': '台灣出生之本籍國民',
        '3': '台灣出生之本籍國民',
        '4': '台灣出生之本籍國民',
        '5': '台灣出生之本籍國民',
        '6': '入籍國民，原為外國人',
        '7': '入籍國民，原為無戶籍國民',
        '8': '入籍國民，原為港澳居民',
        '9': '入籍國民，原為大陸地區居民'
    }
    citizenship_text = citizenship_map.get(third_code, '未知')

    cursor.execute(
        "UPDATE ID_table SET country=?, gender=?, citizenship=? WHERE rowid=?",
        (city, gender_text, citizenship_text, rowid)
    )

# ====== 8. 一次 commit ======
connection.commit()
connection.close()

print(f"✅ 已更新 {len(valid_ids)} 筆合法身分證")
print(f"❌ 已刪除 {len(invalid_ids)} 筆不合法身分證（含第二碼非 1/2/8/9）")
print("🎉 所有資料已處理完成！")

# ====== 9. 查詢函式 ======
def describe_id(id_number):
    id_clean = id_number.strip().upper()
    city = CITY_NAME_MAP.get(id_clean[0], '未知地區')

    if id_clean[1] == '1':
        gender = '男性'
    elif id_clean[1] == '2':
        gender = '女性'
    elif id_clean[1] in ['8', '9']:
        gender = '居留證持有人'
    else:
        gender = '未知'

    third_code = id_clean[2]
    citizenship_map = {
        '0': '台灣出生之本籍國民',
        '1': '台灣出生之本籍國民',
        '2': '台灣出生之本籍國民',
        '3': '台灣出生之本籍國民',
        '4': '台灣出生之本籍國民',
        '5': '台灣出生之本籍國民',
        '6': '入籍國民，原為外國人',
        '7': '入籍國民，原為無戶籍國民',
        '8': '入籍國民，原為港澳居民',
        '9': '入籍國民，原為大陸地區居民'
    }
    citizenship = citizenship_map.get(third_code, '未知')

    return f"{id_clean}：{city}、{gender}、{citizenship}"


# ====== 10. 互動輸入 ======
user_input = input("請輸入身分證字號：").upper()
if is_valid_id(user_input):
    print(describe_id(user_input))
else:
    print("請重新輸入。")
