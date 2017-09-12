/*
This is:
 
*Transformation
*API
 for
*Chamber
*Of
*Secrets

or TACOS for short. It allows a generic "click to open door" mechanic where the object in the room itself defines it's own opening waypoints. 
This allows the room to define door movements instead of editing the JS for every door.
It also allows a "click to write text to chat" mechanic.

As far as licensing, here's how this is going to go:
*If you use this JS file and don't edit it at all, keep the file name intact; TACOS_Vnazrin.1.1 -> TACOS_Vnazrin.1.1
*If you use this JS file and and edit it to suit your purposes, change the name after the V to your janus name and print what the last file name was in the space pervided; TACOS_Vnazrin.2.7 -> TACOS_Valusion.1.0
here ---->

<----
This will allow us some order to figuring out the telephone game that will be the versioning of this file.
*If you only use bits and peices of this file in some other JS file, you need to add a comment "glory be the banana" somewhere near the top of your file.
*If you meet Nazrin some day, and you think this stuff was worth it, you can buy him a JanusVR hoodie in return.

*/

/*
Functions:
rDoor(js_id , rotation degrees , duration , delay , flag type);
sDoor(js_id , deltax , deltay , deltaz , duration , delay , flag type);
Text(user name , Text);
mText(user name , ['array','of','text']);
PlaySound(js_id);
Teleport(posx,posy,posz,delay);
rTeleport(deltax,deltay,deltaz,delay);




*/






var names=[];
var delaying=[];
var durations=[];
var countdown=[];

var rotstart=[];
var rotdelta=[];

var transstart=[];
var transdelta=[];

var lockednames=[];
var toreverse=[];

var sounds=[];
var sdelaying=[];

var teleports=[];
var tdelaying=[];

var colors=[];
var cdelaying=[];

var slides=[];
var slidestart=[];
var sldelaying=[];


room.onLoad = function(){}

room.update = function(delta)
{
  var arrayLength = names.length; 
  for (var i = 0; i < arrayLength; i++)
  {
    if (delaying[i]>0)
    {
      delaying[i] -= delta;
      if(delaying[i]<=0){
        transstart[i] = Vector(room.objects[names[i]].pos.x,room.objects[names[i]].pos.y,room.objects[names[i]].pos.z);
        rotstart[i]   = Math.atan2(room.objects[names[i]].fwd.x, room.objects[names[i]].fwd.z);
      }
    }else{
      countdown[i] -= delta;
      
      //so we don't overshoot
      if (countdown[i]<0){countdown[i]=0;}
      //what percent are we to completeing the transformation
      var percent = 1 - (countdown[i]/durations[i]);
      var currrot = rotstart[i] + (percent * rotdelta[i]);
      rotateXYZ(currrot,0,0,names[i]);
      room.objects[names[i]].pos.x = transstart[i].x + (percent * transdelta[i].x);
      room.objects[names[i]].pos.y = transstart[i].y + (percent * transdelta[i].y);
      room.objects[names[i]].pos.z = transstart[i].z + (percent * transdelta[i].z);
      
      if (countdown[i]<=0)
      {
        names.splice(i, 1);
        delaying.splice(i, 1);
        durations.splice(i, 1);
        countdown.splice(i, 1);
        
        rotstart.splice(i, 1);
        rotdelta.splice(i, 1);

        transstart.splice(i, 1);
        transdelta.splice(i, 1);
        arrayLength--;
        i--;
      }
    }
  }
  
  arrayLength = sounds.length; 
  for (var i = 0; i < arrayLength; i++)
  {
    if (sdelaying[i]>=0)
    {
      sdelaying[i] -= delta;
      if(sdelaying[i]<=0){
        room.playSound(sounds[i]);
        sounds.splice(i, 1);
        sdelaying.splice(i, 1);
        arrayLength--;
        i--;
      }
    }
  }
  
  arrayLength = teleports.length; 
  for (var i = 0; i < arrayLength; i++)
  {
    if (tdelaying[i]>=0)
    {
      tdelaying[i] -= delta;
      if(tdelaying[i]<=0){
        player.pos.x=teleports[i][0];
        player.pos.y=teleports[i][1];
        player.pos.z=teleports[i][2];
        teleports.splice(i, 1);
        tdelaying.splice(i, 1);
        arrayLength--;
        i--;
      }
    }
  }
  
  arrayLength = colors.length; 
  for (var i = 0; i < arrayLength; i++)
  {
    if (cdelaying[i]>=0)
    {
      cdelaying[i] -= delta;
      if(cdelaying[i]<=0){
        room.objects[colors[i][0]].col.x = colors[i][1];
        room.objects[colors[i][0]].col.y = colors[i][2];
        room.objects[colors[i][0]].col.z = colors[i][3];
        colors.splice(i, 1);
        cdelaying.splice(i, 1);
        arrayLength--;
        i--;
      }
    }
  }
  
  arrayLength = slides.length; 
  for (var i = 0; i < arrayLength; i++)
  {
    if (sldelaying[i][0]>=0)
    {
      sldelaying[i][0] -= delta;
      if(sldelaying[i][0]<=0){
        slidestart[i][0]=player.pos.x;
        slidestart[i][1]=player.pos.y;
        slidestart[i][2]=player.pos.z;
        
        slides[i][0]-=slidestart[i][0];
        slides[i][1]-=slidestart[i][1];
        slides[i][2]-=slidestart[i][2];

      }
    }else{
      sldelaying[i][1] -= delta;
      
      //so we don't overshoot
      if (sldelaying[i][1]<0){sldelaying[i][1]=0;}
      var percent = 1 - (sldelaying[i][1]/sldelaying[i][2]);
      player.pos.x = slidestart[i][0] + (percent * slides[i][0]);
      player.pos.y = slidestart[i][1] + (percent * slides[i][1]);
      player.pos.z = slidestart[i][2] + (percent * slides[i][2]);
      
      if (sldelaying[i][1]<=0)
      {
        slides.splice(i, 1);
        slidestart.splice(i, 1);
        sldelaying.splice(i, 1);
        arrayLength--;
        i--;
      }
    }
  }
  
}

//rotating door: allows an object to rotate a certain amount within a certain duration after a certain delay.
//usage: onclick="rDoor('frontdoor',90,1,0,'once')"
//result: the object with js_id="frontdoor" will swing 90 degrees clockwise within 1 second after waiting 0 seconds. Will only work once.
//valid flags are 'once','repeat', and 'reverse'. default is 'repeat'
//there is currently a bug with reverse and repeat where if you spam click the object, it will end up in stange positions.
function rDoor(name,rotDeg,duration,delay,type)
{
  
  if(lockednames.indexOf(name)==-1){
    if(type=='once'){
      lockednames.push(name);
    } 
    names.push(name);
    delaying.push(delay*1000);
    durations.push(duration*1000);
    countdown.push(duration*1000);
    rotstart.push(Math.atan2(room.objects[name].fwd.x, room.objects[name].fwd.z));
    //yes, I know about the reverse bug. I'll fix it later
    if(type=='reverse'){
      if(toreverse.indexOf(name)==-1){
        toreverse.push(name);
        rotdelta.push(-Math.PI*2*rotDeg/360);
      }else{
        toreverse.splice(toreverse.indexOf(name),1);
        rotdelta.push(Math.PI*2*rotDeg/360);
      }
    }else{
      rotdelta.push(-Math.PI*2*rotDeg/360);
    }
    transstart.push(Vector(room.objects[name].pos.x,room.objects[name].pos.y,room.objects[name].pos.z));
    transdelta.push(Vector(0,0,0));
  }
}

//sliding door: allows an object to slide a certain amount within a certain duration after a certain delay.
//usage: onclick="sDoor('frontdoor',1,-15,2,1,0,'once')"
//result: the object with js_id="frontdoor" will move 1 meter in the x direction, 15 meters down and 2 meters in z. All within 1 second after waiting 0 seconds. Will only work once.
//valid flags are 'once','repeat', and 'reverse'. default is 'repeat'
//there is currently a bug with reverse and repeat where if you spam click the object, it will end up in stange positions.
function sDoor(name,deltax,deltay,deltaz,duration,delay,type)
{
  
  if(lockednames.indexOf(name)==-1){
    if(type=='once'){
      lockednames.push(name);
    } 
    names.push(name);
    delaying.push(delay*1000);
    durations.push(duration*1000);
    countdown.push(duration*1000);
    rotstart.push(Math.atan2(room.objects[name].fwd.x, room.objects[name].fwd.z));
    //yes, I know about the reverse bug. I'll fix it later
    if(type=='reverse'){
      if(toreverse.indexOf(name)==-1){
        toreverse.push(name);
        transdelta.push(Vector(deltax,deltay,deltaz));
      }else{
        toreverse.splice(toreverse.indexOf(name),1);
        transdelta.push(Vector(-deltax,-deltay,-deltaz));
      }
    }else{
      transdelta.push(Vector(deltax,deltay,deltaz));
    }
    transstart.push(Vector(room.objects[name].pos.x,room.objects[name].pos.y,room.objects[name].pos.z));
    rotdelta.push(0);
  }
}


//text: allows for an object to put a text string in chat. The first argument is what the player name looks like.
//usage: onclick="Text('That weird guy','I don\'t see anything wrong here.')"
//output: That weird guy: I don't see anything wrong here.
function Text(name,Text)
{
  name = name.replace(/ /g, " "); //black magic. Mecca Lecca Hi, Mecca Hiney Ho.
	print(name + ' ' + Text);
}


//multi choice text: allows for an object to put more than one text string in chat. randomises the array. The first argument is what the player name looks like.
//usage: onclick="mText('The count says',['one','two','three ha ha ha'])"
//output:
/*
The count says: three ha ha ha
The count says: one
The count says: two
*/
function mText(name,TextArray)
{
  name = name.replace(/ /g, " "); //black magic. Hocus Pocus.
	print(name + ' ' + TextArray[Math.floor(Math.random() * Object.keys(TextArray).length)]);
}

//Play sound: Plays a sound. Really simple
//usage: onclick="PlaySound('beep', 1000);"
//output: beeps after one second
function PlaySound(name,delay)
{
  sounds.push(name);
  sdelaying.push(delay);
}

//Teleport: teleports you to coordinates after a delay of miliseconds
//usage: onclick="Teleport(1,2,3,1000);"
//output: teleports you to 1,2,3 after 1 second
function Teleport(posx,posy,posz,delay)
{
  teleports.push([posx,posy,posz]);
  tdelaying.push(delay);
}

//Relative Teleport: teleports you an offset ammount after a delay of miliseconds
//usage: onclick="rTeleport(1,0,0,0);"
//output: teleports you 1 meter in the x direction.
function rTeleport(deltax,deltay,deltaz,delay)
{
  teleports.push([player.pos.x+deltax,player.pos.y+deltay,player.pos.z+deltaz]);
  tdelaying.push(delay);
}

//Slide: slowly move the player to the coordinates after a delay of miliseconds
//usage: onclick="Slide(0,2,0,3000,0);"
//output: the player will be moved to 0,2,0 over the course of 3 seconds.
function Slide(posx,posy,posz,duration,delay)
{
  slides.push([posx,posy,posz]);
  slidestart.push([posx,posy,posz]);
  sldelaying.push([delay,duration,duration]);
}

//Color: sets the color atribute of an object after a delay of miliseconds
//usage: onclick="Color('mycube',0,0,0,1000);"
//output: turns the object with js_id of 'mycube' black after one second.
function Color(name,red,blue,green,delay)
{
  colors.push([name,red,blue,green]);
  cdelaying.push(delay);
  room.objects[name].col.x = red;
  room.objects[name].col.x = blue;
  room.objects[name].col.x = green;
  tdelaying.push(delay);
}





/*
Utilities. Do not use in your JML code
*/
//euler angles to rotation matrix
function rotateXYZ(xrot, yrot, zrot, rot){
    var A       = Math.cos(xrot);
    var B       = Math.sin(xrot);
    var C       = Math.cos(yrot);
    var D       = Math.sin(yrot);
    var E       = Math.cos(zrot);
    var F       = Math.sin(zrot);

    room.objects[rot].xdir = Vector(A*E , A*F , -B);
    room.objects[rot].ydir = Vector(D*B*E - C*F , D*B*F + C*E , A*D);
    room.objects[rot].zdir = Vector(C*B*E + D*F , C*B*F - D*E , A*C);
}
