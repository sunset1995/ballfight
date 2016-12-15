# SNP 期末專題 - Ballfight

![競技場螢幕截圖](images/arena.png)  
遊戲有三個元件：
- [競技場](http://snp2016.nctu.me/)：請用電腦瀏覽器打開，為遊戲進行的場所
- hero.py：控制競技場中的英雄，讓他在遊戲中獲勝
    - [在 windows 上](install/ballfight-windows.md)
    - [在 mac 上](install/ballfight-mac.md)
    - [在 ubuntu 上](install/ballfight-ubuntu.md)
    - [在 c9 上](install/ballfight-c9.md)

有任何問題請用力地把信寄給 `s2821d3721@gmail.com`  




## 勝負條件
- 競技場上有紅方藍方個兩顆球
- 當有一方兩顆球同時超出競技場外遊戲結束
- 當遊戲結束時，藍方都在界外即算紅方勝利




## 遊戲規則
- 雙方能做的的操作只有對自己的球施予 `[fx, fy]` 的力
- 施力會受到干擾而隨機被轉 ±30deg
- 球的移動會受到與當前速度方向相反的摩差力影響 (`friction = [-v[0], -v[1]]`)
- 施力最大為 `1000`，超過的話會以 `1000` 算
- 初始競技場半徑為 `350`，且會漸漸縮小 (每秒半徑減少 `20`)
- 雙方球的半徑皆為 `25`
- 競技場的圓心為座標系統 `(0, 0)`，右邊為 x 軸正向，下方為 y 軸正向
- 藍方初始位置：左上`(-200, -200)`, 右上`(200, -200)`
- 紅方初始位置：左下`(-200, 200)`, 右下`(200, 200)`




## 競技場介紹

### 設定連線
![設定連線螢幕截圖](images/arena-1.png)  
有兩種模式可以選擇：  
- 離線模式 `Offline mode`：妳只能用鍵盤
- 連線模式 `Create Room`：妳可以透過撰寫 python 連上此 Room 與其他人決鬥
    - 網頁與妳的 python 需透過一個中央伺服器作為資料傳輸的代理人 (broker) 來交換資料，該代理人會負責各 Room 的資料傳輸，一個代理人可以處理很多個不同的房間
    - `broker url`：代理人(broker)的網址，為負責將資料送到正確的地方的中央伺服器
    - `room name`：這個競技場的房間名

> FYI  
> 一個 room 在手機，競技場，hero 進行遊戲時，伺服器的網路負擔約為進出各 5KB/s  

> FYI  
> 為何需要一個中央伺服器當代理人 (broker) 呢？  
> 因為正常的家用電腦通常只作為客戶端 (client) 使用，瀏覽器更是一個客戶端 (client) 的程式  
> 所以正常來說妳的電腦只能『主動』向外發出請求 (request) 說『請給我這個網頁』『我要這個檔案，請給我下載』  
> 但是無法像伺服器 (server) 『被動』的接受上面的這些 request  
> 就算妳用妳的電腦架好了伺服器，也很可能被其他防火牆擋下來  
> 如：連上家用的無限路由器後，在沒做額外設定的情況下，家裡的路由器會把外面的請求擋在外面  
> 所以這裡的解法如早期的 Skype，妳的 python script 及競技場的那個網頁會『主動』的跟中央伺服器建立連線  
> 當妳的 python script 要傳資料給競技場網頁時，事實上會先送給中央伺服器，該伺服器再送給競技場


### 選擇角色
![選擇角色螢幕截圖](images/arena-2.png)  
下方四個紅藍方塊按下後，可以幫其選取角色(策略)。所有可選的角色呈現在上方的黑色方塊中，其中比較特別的是：  
- `` 空白代表什麼都不做
- `WASD space` 用 WASD 鍵控制方向，空白鍵加速
- `↑←↓→ enter` 用上下左右鍵控制方向，enter 鍵加速  

若妳選擇連線模式，在妳的 python 註冊策略後將可在角色欄位中看到並可以選取，但一個 python 只能玩一個角色，若妳想要一次控制兩隻，請執行兩個註冊不同名字的 _hero.py_  




## 用 python script 玩

打開 _hero.py_
```python
import api


def strategy():

    info = api.get()
    print('=======================')
    print('radius', api.getRadius())
    print('me    ', api.getMe())
    print('friend', api.getFriend())
    print('enemy1', api.getEnemy1())
    print('enemy2', api.getEnemy2())

    return [1000, 1000, 'gogo']


api.play('ws://demo-bf-sunset1995.c9users.io:8080/ws', 'demo-room', '君の名', strategy)
```
妳可以 `import` 所有妳需要用到的套件，此外一定要 `import api` 以進行連線與註冊妳的策略。  
在函數 `strategy` 裡面實作妳的策略，透過 `api` 取得所有場面資訊然後回傳妳想要的施力大小。此函數當場面_狀態改變_時被呼叫。以下任一條件皆會造成_狀態改變_：  
- 遊戲結束變進行中或反之
- 遊戲進行中，任何場面資訊的更新


### 連線
`api.play('ws://demo-bf-sunset1995.c9users.io:8080/ws', 'demo-room', '君の名', strategy)`  
- 第一個參數 `ws://demo-bf-sunset1995.c9users.io:8080/ws` 代表伺服器 url，請換成跟妳想要去的競技場一樣的網址
- 第二個參數 `demo-room`，請換成跟妳想要去的競技場一樣的房間名
- 第三個參數 `君の名` 是妳的名字，請留意別跟其他同房的人撞名
- 第四個參數 `strategy` 為上面實作的遊戲策略
- __注意__ 此行以下的程式碼將不會被執行，所以請把它擺在 python 程式碼的尾端


### strategy 的回傳值
請回傳一個 `list: [x 方向施力, y 方向施力]`  
若想要與隊友溝通可以把字串放在第三個位置，如：`[1000, 1000, 'fight enemy1 first!!']`  


### 取得場面資訊
用 api 取得場面資訊的方法如下：  
- `api.getRadius()` 回傳一 _float_ 表示當前競技場半徑
- `api.getState()` 回傳一 _string_ 代表遊戲輸贏狀態或仍然在進行中
- `api.getMe()`, `api.getFriend()`, `api.getEnemy1()`, `api.getEnemy2()` 回傳一 _list_ 代表該角色目前的資訊，list 長度為 5 包含該角色的所有資訊： [x, y, vx, vy, '說的話']
- `api.get()` 提供另一種取得資訊的方式，這會回傳一 _dict_ 包含上述所有資訊，結構如下：  
```
{
    'state': 'Hello',
    'me': { 'x': 0, 'y': 0, 'vx': 0, 'vy': 0, 'say': '', },
    'friend': { 'x': 0, 'y': 0, 'vx': 0, 'vy': 0, 'say': '', },
    'enemy1': { 'x': 0, 'y': 0, 'vx': 0, 'vy': 0, 'say': '', },
    'enemy2': { 'x': 0, 'y': 0, 'vx': 0, 'vy': 0, 'say': '', },
    'radius': 0,
}
```
此外，我們會把競技場翻轉，讓所有 _hero.py_ 看到的初始狀態為 __總是自己在左上角也就是 (-200, -200)__，而隊友在右上角  
妳與妳的隊友的 `enemy1` 將會是同一個對手，也就是說若妳的 `enemy1` 在妳的正對面，則妳隊友看到的 `enemy1` 會在斜對面。同理 `enemy2`。  


### 執行
在黑盒子(terminal)進入 _hero.py_ 所在資料夾，執行 `python3 hero.py` 即會向該競技場註冊妳的策略。  
