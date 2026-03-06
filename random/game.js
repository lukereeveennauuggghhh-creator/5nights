class GameScene extends Phaser.Scene {

constructor(){
super("GameScene")
}

preload(){

this.load.image("office","images/office.png")

this.load.image("jeff","images/jeff.png")
this.load.image("donald","images/donald.png")
this.load.image("bill","images/bill.png")
this.load.image("benanyahu","images/benanyahu.png")

}

create(){

this.power = 100
this.nightTimer = 60000
this.isGameOver = false

this.doorsLocked = {
left:false,
right:false
}

// office background
this.add.image(512,384,"office")

// UI
this.powerText = this.add.text(20,20,"Power:100%",{fontSize:"22px"})
this.timerText = this.add.text(850,20,"1:00",{fontSize:"22px"})

this.leftDoorText = this.add.text(100,700,"[L] LEFT DOOR OPEN",{fontSize:"20px"})
this.rightDoorText = this.add.text(700,700,"[R] RIGHT DOOR OPEN",{fontSize:"20px"})

// enemy distance text
this.enemyText = this.add.text(512,500,"",{fontSize:"28px",align:"center"}).setOrigin(.5)

// enemy images
this.enemySprites = {

jeff:this.add.image(200,300,"jeff").setScale(.35).setVisible(false),
donald:this.add.image(800,300,"donald").setScale(.35).setVisible(false),
bill:this.add.image(350,350,"bill").setScale(.35).setVisible(false),
benanyahu:this.add.image(650,350,"benanyahu").setScale(.35).setVisible(false)

}

// enemy data
this.characters = [

{name:"Jeff", key:"jeff", stage:0, side:"left"},
{name:"Donald", key:"donald", stage:0, side:"right"},
{name:"Bill", key:"bill", stage:0, side:"left"},
{name:"Benanyahu", key:"benanyahu", stage:0, side:"right"}

]

// controls
this.input.keyboard.on("keydown-L",()=>this.toggleDoor("left"))
this.input.keyboard.on("keydown-R",()=>this.toggleDoor("right"))

// enemy movement timer
this.time.addEvent({
delay:2500,
callback:this.moveEnemies,
callbackScope:this,
loop:true
})

this.updateEnemyText()

}

toggleDoor(side){

this.doorsLocked[side] = !this.doorsLocked[side]

let status = this.doorsLocked[side] ? "CLOSED" : "OPEN"

if(side=="left")
this.leftDoorText.setText("[L] LEFT DOOR "+status)
else
this.rightDoorText.setText("[R] RIGHT DOOR "+status)

}

moveEnemies(){

if(this.isGameOver) return

this.characters.forEach(enemy=>{

if(Math.random() < .5){

enemy.stage++

}

if(enemy.stage >= 3){

if(this.doorsLocked[enemy.side] === false){

this.gameOver(enemy)

}else{

enemy.stage = 1

}

}

})

this.updateEnemyText()
this.updateEnemyImages()

}

updateEnemyImages(){

Object.values(this.enemySprites).forEach(sprite=>sprite.setVisible(false))

this.characters.forEach(enemy=>{

if(enemy.stage >= 1){

this.enemySprites[enemy.key].setVisible(true)

}

})

}

updateEnemyText(){

let text=""

this.characters.forEach(enemy=>{

let distance="Far"

if(enemy.stage==1) distance="Hallway"
if(enemy.stage==2) distance="At Door"

text += enemy.name + " - " + distance + "\n"

})

this.enemyText.setText(text)

}

update(time,delta){

if(this.isGameOver) return

this.nightTimer -= delta

let seconds = Math.ceil(this.nightTimer/1000)
let minutes = Math.floor(seconds/60)
let secs = seconds % 60

this.timerText.setText(minutes+":"+secs.toString().padStart(2,"0"))

this.power = Math.max(0,this.power - .02)
this.powerText.setText("Power:"+Math.floor(this.power)+"%")

if(this.nightTimer <= 0){

this.win()

}

}

gameOver(enemy){

this.isGameOver = true

this.add.rectangle(512,384,1024,768,0x000000).setAlpha(.9)

this.add.image(512,250,enemy.key).setScale(.6)

this.add.text(512,420,enemy.name+" touched u",{
fontSize:"60px",
color:"#ff0000"
}).setOrigin(.5)

this.add.text(512,520,"PRESS R TO RESTART",{
fontSize:"32px"
}).setOrigin(.5)

this.input.keyboard.once("keydown-R",()=>{
this.scene.restart()
})

}

win(){

this.isGameOver = true

this.add.rectangle(512,384,1024,768,0x000000).setAlpha(.9)

this.add.text(512,380,"YOU SURVIVED",{
fontSize:"72px",
color:"#00ff00"
}).setOrigin(.5)

}

}

const config = {

type:Phaser.AUTO,
width:1024,
height:768,
parent:"game-container",
scene:GameScene

}

new Phaser.Game(config)