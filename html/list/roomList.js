const roomList = document.getElementById('roomList')

document.querySelector('.dropdown-toggle').addEventListener('click', function () {
  const dropdown = document.querySelector('.dropdown');
  dropdown.classList.toggle('open');
});

async function logout(){
  const api = await import("../modules/api.js")
  const token = await api.getToken()
  const result = await api.logout(token)
  if(!result.ok){
    alert(result.statusText)
  }
  window.location.href = '../auth/login.html'
}

async function createRoom(password, opening_time) {
  const api = await import("../modules/api.js")
  try{
    const token = await api.getToken()
    const result = await api.createRoom(token, password, opening_time)
    
    console.log(result)
    if(result.detail == undefined){
      goToRoom(Number(result.id)) 
    }
    else {
      alert(`Request error:\n${result.detail[0].msg}`)
    }
  }
  catch (e) {
    alert(`Error creation rooms:\n${e}`)
  }
}

async function getRooms() {
  const api = await import("../modules/api.js")
  try{
    Rooms = await api.getRooms()
    return(Rooms)
  }
  catch (e) {
    alert(`Error getting rooms:\n${e}`)
    return([])
  }
}

async function updateRooms() { 
  let Rooms = await getRooms() 
  
  Rooms.forEach(room => {
    roomList.innerHTML += `
    <div class = "room ${room.is_active ? 'active' : 'inactive'} ${room.private ? 'private' : ''}" id=room_${room.id}>
      <div class=roomTime>
        Open: ${room.opening_time}
      </div>
    </div>
    `
  });
}

function goToRoom(room_id){
  window.location.href = `../room/room.html?id=${room_id}`
}

document.getElementById('roomList').addEventListener('click', function(event){
  console.log(event.target.id)
  if(event.target.id.slice(0,5)=='room_'){
    let id = Number(event.target.id.slice(5))
    goToRoom(id)
  }
})

updateRooms()
