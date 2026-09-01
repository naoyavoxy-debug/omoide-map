const prefs=["北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島", "茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川", "新潟", "富山", "石川", "福井", "山梨", "長野", "岐阜", "静岡", "愛知", "三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山", "鳥取", "島根", "岡山", "広島", "山口", "徳島", "香川", "愛媛", "高知", "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"]; const positions={'北海道': (82, 12), '青森': (77, 25), '岩手': (82, 29), '宮城': (80, 34), '秋田': (72, 29), '山形': (75, 34), '福島': (77, 39), '茨城': (81, 45), '栃木': (76, 44), '群馬': (71, 45), '埼玉': (75, 49), '千葉': (82, 49), '東京': (78, 51), '神奈川': (76, 54), '新潟': (67, 39), '富山': (61, 45), '石川': (57, 47), '福井': (54, 49), '山梨': (69, 51), '長野': (65, 47), '岐阜': (61, 52), '静岡': (69, 56), '愛知': (63, 56), '三重': (59, 59), '滋賀': (55, 56), '京都': (52, 58), '大阪': (49, 61), '兵庫': (45, 60), '奈良': (52, 63), '和歌山': (48, 66), '鳥取': (39, 57), '島根': (34, 57), '岡山': (40, 61), '広島': (35, 62), '山口': (30, 62), '徳島': (43, 67), '香川': (39, 67), '愛媛': (35, 69), '高知': (39, 72), '福岡': (25, 67), '佐賀': (20, 68), '長崎': (17, 71), '熊本': (23, 73), '大分': (29, 70), '宮崎': (23, 78), '鹿児島': (18, 82), '沖縄': (12, 92)};
let data=JSON.parse(localStorage.getItem("omoideMap")||"{}"),selected="",pendingPhoto="";
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("omoideMap",JSON.stringify(data));render()}
function render(){
 const markers=$("markers");markers.innerHTML="";
 prefs.forEach(p=>{const [x,y]=positions[p],b=document.createElement("button");b.className="marker"+(data[p]?" visited":"");b.style.left=x+"%";b.style.top=y+"%";b.title=p;
 if(data[p]?.photo)b.innerHTML=`<img src="${data[p].photo}"><span>${p.slice(0,1)}</span>`;else b.innerHTML=`<span>${p.slice(0,1)}</span>`;
 b.onclick=()=>openEditor(p);markers.appendChild(b)});
 const entries=Object.entries(data);$("visitedCount").textContent=entries.length;$("memoryCount").textContent=entries.filter(([,m])=>m.photo).length;$("progressText").textContent=Math.round(entries.length/47*100);
 const list=$("memoryList");list.innerHTML="";
 entries.forEach(([p,m])=>{const c=document.createElement("article");c.className="memory";c.onclick=()=>openEditor(p);c.innerHTML=`${m.photo?`<img src="${m.photo}">`:`<div class="placeholder">📍</div>`}<div class="body"><h3>${p}</h3><small>${m.date||"日付なし"}</small><p>${esc(m.note||"")}</p></div>`;list.appendChild(c)});
 if(!entries.length)list.innerHTML='<div class="empty">まだ思い出がありません。<br>地図の丸をタップして最初の旅を残そう 📷</div>';
}
function openEditor(p){selected=p;pendingPhoto=data[p]?.photo||"";$("prefTitle").textContent=p;$("dateInput").value=data[p]?.date||"";$("noteInput").value=data[p]?.note||"";preview(pendingPhoto);$("deleteBtn").style.visibility=data[p]?"visible":"hidden";$("editor").showModal()}
function preview(src){const im=$("preview");if(src){im.src=src;im.style.display="block"}else im.style.display="none"}
$("photoInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{pendingPhoto=r.result;preview(pendingPhoto)};r.readAsDataURL(f)};
$("memoryForm").onsubmit=e=>{e.preventDefault();data[selected]={date:$("dateInput").value,note:$("noteInput").value,photo:pendingPhoto};save();$("editor").close();$("photoInput").value=""};
$("deleteBtn").onclick=()=>{if(confirm(selected+"の思い出を削除する？")){delete data[selected];save();$("editor").close()}};
$("closeBtn").onclick=()=>$("editor").close();
$("resetBtn").onclick=()=>{if(confirm("すべての思い出を消す？")){data={};save()}};
$("randomBtn").onclick=()=>{const keys=Object.keys(data);if(keys.length)openEditor(keys[Math.floor(Math.random()*keys.length)])};
function esc(s){return s.replace(/[&<>""]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
render();