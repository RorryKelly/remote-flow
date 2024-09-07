import { IncomingMessage } from 'http';
import { WebSocketServer } from 'ws';
import { GetAppAccount, GetSessionInformation } from './database/db';
import parse from './jsonParser';
import ChatEvent from './events/event';
import ChatEventFactory from './events/event-factory';

const wss = new WebSocketServer({ port: 1324, host: 'localhost' });

wss.on('listening', async ()=>{
  console.log('started listening on: ' + JSON.stringify(wss.address()));
});

wss.on('connection', async (socket, request)=>{

  //authenticate user
  const user = await AuthenticateConnection(request);
  if(!user){
    socket.close(3000, "Unable to authenticate user");
    return;
  }


  socket.on('message', async (data, binary)=>{
    try{
      console.log(JSON.stringify(user));
      const eventObj = parse<ChatEvent>(data.toString());
      const event = ChatEventFactory.CreateEvent(socket, eventObj);
      await event.execute(user);
    } catch (e){
      console.log('ERROR: ' + e)
    }
  });

  socket.on('close', ()=>{
  })
});

async function AuthenticateConnection(request: IncomingMessage){
  const cookiePos = request.rawHeaders.findIndex((value, index, obj) => value === "Cookie");
  if(!cookiePos || cookiePos == -1){
    return null;
  }

  const cookieString = request.rawHeaders[cookiePos + 1];
  const sessionId = getCookieValue(cookieString, 'authjs.session-token');

  const session = await GetSessionInformation(sessionId);
  if(!session || !session){
    return null;
  }
  const appAccount = await GetAppAccount(session.userId.toString());

  return appAccount;
}

function getCookieValue(cookieString: string, cookieKey: string){
  const cookies = cookieString.split('; '); 
  for (const cookie of cookies) {
      const [key, value] = cookie.split('='); 
      if (key === cookieKey) {
          return value; 
      }
  }

  return "";
}