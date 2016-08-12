# SNP 期末專題 - Ballfight

## 勝負條件
- 競技場(黑色範圍)含有英雄(綠球)與怪物(紅球)
- 當有一方整顆球超出競技場外遊戲結束
- 當遊戲結束時，綠球沒在界外即算綠球獲勝



<br>
## 遊戲規則
- 雙方能做的的操作只有對自己的球施予 `[fx, fy]` 的力
- 球的移動會受到與速度方向相反的摩差力影響
- 施力最大為 `1000`，超過的話以 `1000` 算
- 初始競技場半徑為 `350`，且會漸漸縮小
- 雙方球的半徑皆為 `25`
- 競技場的圓心為座標系統 `(0, 0)`，右邊為 x 軸正向，下方為 y 軸正向
- 英雄(綠球)初始位置 `(0, 250)`
- 怪物(紅球)初始位置 `(0, -250)`



<br>
## 開始前
資料夾含有
- _api.py_：裡面實作了連線與取得場面資訊的函數
- _requirement.txt_：寫了 _api.py_ 所需要的套件
- _hero.py_：範例程式碼，你們需要實作的部分

將上面三個檔案下載到同一個資料夾，然後在黑盒子(terminal)進入該資料夾使用 pip 指令下載所需套件：
```
pip3 install -r requirement.txt
```
完成後即可開始編輯 _hero.py_ 囉～



<br>
## 開始吧！


### 英雄
打開 _hero.py_
```python
import api


def strategy():
    state = api.getState()
    myPos = api.getMyPosition()
    mySpeed = api.getMySpeed()
    enemyPos = api.getEnemyPosition()
    enemySpeed = api.getEnemySpeed()
    arenaR = api.getArenaRadius()
    gsensor = api.getGsensor()

    return [-gsensor[0], gsensor[1]]


api.setRoom('yourname')
api.setMonster('softer')

api.play(strategy)
```
你可以 `import` 所有你需要用到的套件，此外一定要 `import api` 已取得場面資訊與設定連線。  
在函數 `strategy` 裡面實作你的策略，此函數當場面`狀態改變`時被呼叫。以下任一條件皆會造成`狀態改變`：  
- 遊戲結束變進行中或反之
- 遊戲進行中，任何場面資訊的更新

在函數 `strategy` 裡面取得最新的場面資訊並以此下決策。上面的範例 code 已把所有可以取得的場面資訊幫你存在變數裡了，說明如下：  
- api.getState()：空字串代表遊戲進行中，否則回傳 `win` 或 `lose`
- api.getMyPosition()：`[x, y]` 代表你的位置
- api.getMySpeed()：`[vx, vy]` 代表你的速度
- api.getEnemyPosition()：`[x, y]` 代表敵人的位置
- api.getEnemySpeed()：`[vx, vy]` 代表敵人的速度
- api.getArenaRadius()：一個浮點數代表半徑
- api.getGsensor()：`[gx, gy]` 代表手機重力感應器的資訊


設定連線：  
`api.setRoom('yourname')` 把 `yourname` 換成由**英數字**組成獨一無二的名字。不同 room 的玩家不會相互影響到。  
`api.setMonster('softer')` 設定對手 AI，目前可選的有(注意大小寫)：  
- loser
- softer
- brownian
- rusher
- centerCamper

預設伺服器為 TA 的伺服器，可以不用動這邊。若要更換伺服器請使用 `api.setUrl('another.server')`  
`api.play(strategy)` 連線進行遊戲，`strategy` 為剛剛實作用來做決策的函數。__注意__ 此行以下的程式碼將不會被執行。  


在黑盒子(terminal)執行 `python3 hero.py` 以執行 hero。


### 觀察者
到此為止已實作好英雄的程式，接者打開瀏覽器連上[觀察者](http://snp2016.nctu.me/)以讓遊戲開始並檢視對戰過程。  
連上後 _Connection setting_ 的部分：  
- url：已預設填上 TA 的伺服器，可以不用動這邊
- room：請填上剛剛英雄進去的 room
按下 _Submit_ 即可進入該 room。進入後按下 _Fight_ 可讓遊戲開始。  


### 手機重力感應器
若想要使用手機的重力感應器，請連上[此](http://snp2016.nctu.me/)。設定同上。  
若沒有連上的話，api.getGsensor() 的結果將為 `[0, 0]` 或上次手機斷線時會後一筆資料。  



<br>
## PVP
若你想讓你的兩支程式對戰，你需要：  
1. 新建檔案 `monster.api` 在同一個資料夾  
2. 將 `hero.api` 裡的東西複製到 `monster.api`  
3. 將兩邊的 `api.setMonster('softer')` 各自換成 `api.setPVP('hero')` 跟 `api.setPVP('monster')`  
4. 實作各自的 strategy  
5. 在兩個黑盒子(terminal)分別執行 `python3 hero.py`, `python3 monster.py`  
6. 打開觀察者(詳見上面)  



<br>
## AI Trainer
若你想要訓練你的 AI 玩這個遊戲：  
- `api.play(strategy, True)` 將第二個選擇性的參數設成 `True` 伺服器將會在遊戲結束後一秒鐘自動開始新遊戲  
- 還是可以利用觀察者觀戰
- 聯絡 TA `s2821d3721@gmail.com` 協助你私架此遊戲的伺服器
