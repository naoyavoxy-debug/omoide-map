const prefs=["北海道","青森","岩手","宮城","秋田","山形","福島","茨城","栃木","群馬","埼玉","千葉","東京","神奈川","新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知","三重","滋賀","京都","大阪","兵庫","奈良","和歌山","鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知","福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄"];
let data=JSON.parse(localStorage.getItem("omoideMap")||"{}"), selected="", pendingPhoto="";
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("omoideMap",JSON.stringify(data));render()}
function render(){
  $("map").innerHTML="";
  prefs.forEach(p=>{
    const b=document.createElement("button"); b.className="pref"+(data[p]?" visited":"");
    if(data[p]?.photo)b.innerHTML=`<img src="${data[p].photo}"><span>${p}</span>`; else b.innerHTML=`<span>${p}</span>`;
    b.onclick=()=>openEditor(p); $("map").appendChild(b);
  });
  const visited=Object.keys(data).filter(k=>data[k]).length;
  $("visitedCount").textContent=visited; const pc=Math.round(visited/47*100);
  $("progressBar").style.width=pc+"%"; $("progressText").textContent=`日本制覇 ${pc}%`;
  const list=$("memoryList"); list.innerHTML="";
  Object.entries(data).forEach(([p,m])=>{
    const c=document.createElement("div"); c.className="memory"; c.onclick=()=>openEditor(p);
    c.innerHTML=`${m.photo?`<img src="${m.photo}">`:`<div style="height:130px;display:grid;place-items:center;background:#f7e8ed;font-size:36px">📍</div>`}<div class="body"><h3>${p}</h3><small>${m.date||"日付なし"}</small><p>${escapeHtml(m.note||"")}</p></div>`;
    list.appendChild(c);
  });
  if(!list.children.length)list.innerHTML='<div class="empty">まだ思い出がありません 📷</div>';
}
function openEditor(p){
  selected=p; pendingPhoto=data[p]?.photo||""; $("prefTitle").textContent=p+"の思い出";
  $("dateInput").value=data[p]?.date||""; $("noteInput").value=data[p]?.note||"";
  showPreview(pendingPhoto); $("deleteBtn").style.visibility=data[p]?"visible":"hidden"; $("editor").showModal();
}
function showPreview(src){const im=$("preview"); if(src){im.src=src;im.style.display="block"}else{im.removeAttribute("src");im.style.display="none"}}
$("photoInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{pendingPhoto=r.result;showPreview(pendingPhoto)};r.readAsDataURL(f)};
$("memoryForm").onsubmit=e=>{e.preventDefault();data[selected]={date:$("dateInput").value,note:$("noteInput").value,photo:pendingPhoto};save();$("editor").close();$("photoInput").value=""};
$("deleteBtn").onclick=()=>{if(confirm(selected+"の思い出を削除する？")){delete data[selected];save();$("editor").close()}};
$("closeBtn").onclick=()=>$("editor").close();
$("resetBtn").onclick=()=>{if(confirm("すべての思い出を消す？")){data={};save()}};
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
render();