# 在 Mac 上設定 hero.py

### 下載與安裝
下載 [hero.py for Mac](http://snp2016.nctu.me/ballfight-mac.zip) 並解壓縮  
開啟 terminal，利用指令 `cd` 進入剛剛解壓縮後的 _ballfight-mac_ 資料夾  
輸入以下指令安裝 dependency
```
pip install -r requirements.txt
```
完成！可開始實作 hero 的策略並進行遊戲！


### 執行 hero.py
開啟 terminal，利用指令 `cd` 進入 _hero.py_ 所在的資料夾，輸入
```
python3 hero.py
```
就會連上伺服器，並利用你實作在 _hero.py_ 中的策略控制英雄。  

**注意**：若你更新了 _hero.py_，需要在 terminal 中 `ctrl+C` 結束原本連線中的 _hero.py_ 並重新執行 `python3 hero.py`
