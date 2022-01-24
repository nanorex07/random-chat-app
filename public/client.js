
const socket = io({autoConnect: false});

const client_name = document.getElementById("client_name");
const start_chat = document.getElementById("start_btn");
const home_sec = document.getElementById("home-section");
const message_sec = document.getElementById("message-section");
const message_div = document.getElementById("message-div");
const exit_btn = document.getElementById("exit-btn");
const send_btn = document.getElementById("send-btn");
const message_input = document.getElementById("message");
const client_color = document.getElementById("client_color");
const total_users = document.getElementById("online-users")


let connected = false;

const swtich_to_chat = ()=>{
    home_sec.style.display = "none";
    message_sec.style.display = "block";
}

exit_btn.addEventListener('click', ()=>{
    socket.disconnect();
    connected = false;
    home_sec.style.display = "block";
    message_sec.style.display = "none";
})

const send_msg = (e)=>{
    if ((e instanceof KeyboardEvent && e.code=='Enter') || e instanceof PointerEvent){
        if(message_input.value){
            socket.emit("chat-message", message.value);
            const adder = `
            <div class="row mt-2 justify-content-end">
            <div class="col-8 border bg-light p-2 rounded">
              <p class="fw-bold" style="color: ${client_color.value};">You</p>
              <p class="fw-normal">${message_input.value}</p>
            </div>
            </div>
            `   
            if(connected){
                message_div.innerHTML += adder;
                message_input.value = ''
                message_div.scrollTop = message_div.scrollHeight;
            }
        }
    }

}

socket.on('increment-users', (users)=>{
    total_users.innerHTML = `${users} online`;
})

socket.on('toggle-connection', ()=>{
    if(connected){
        connected = false;
    }else{
        connected = true;
        message_div.innerHTML = '';
    }
})

socket.on('info', (msg) => {
    const adder = `
    <div class="row mt-2 justify-content-center">
        <div class="col d-flex justify-content-center p-2">
            <p class="fw-normal text-secondry fw-italic">${msg}</p>
        </div>
    </div>
    `
    message_div.innerHTML += adder;
    message_div.scrollTop = message_div.scrollHeight;

})

socket.on('new-msg', (obj) => {
    const adder = `
    <div class="row mt-2 justify-content-start">
        <div class="col-8 border bg-light p-2 rounded">
            <p class="fw-bold text" style="color: ${obj.color};">${obj.name}</p>
            <p class="fw-normal text">${obj.message}</p>
        </div>
    </div>
    `
    message_div.innerHTML += adder;
    message_div.scrollTop = message_div.scrollHeight;

})

start_chat.addEventListener("click", ()=>{
    if(client_name.value === ''){
        alert("please enter a name to start");
        return;
    }
    message_div.innerHTML = ''
    const auth = { username: client_name.value, color: client_color.value};
    socket.connect()
    socket.emit("client_info", auth)
    swtich_to_chat();
})

send_btn.addEventListener("click", send_msg);
message_input.addEventListener("keyup", send_msg);