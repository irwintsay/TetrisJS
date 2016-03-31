![Tetris](http://i.imgur.com/BCAahHml.png "Tetris")

# JavaScript Tetris

Hello! Welcome to my Tetris game!!

This project was all about re-creating one of my favorite childhood games. When I first considered doing this project, I had serious doubts about whether I was biting off more than I could chew. Even after a LOT of prototyping over the weekend, I still wasn't sure what the final product would look like. I'm sooo pumped to say that this project ultimately exceeded my own expectations!

### Prototyping

I tried a lot of things during my initial prototyping phase. I played around with representing Tetris with divs and manipulating those divs directly. That made my head hurt. I scrapped that idea as I realized manipulating and moving divs was going to be tough, and performing collision detection and line clearing **EVEN** harder. My next idea, the one I ultimately settled on, was to represent the Tetris game space with a **nested array**. The Tetris game space is merely a 20 unit by 10 unit grid. Using arrays to represent this space made it easier for me to wrap my mind around handling the logic for the game, even though that logic would still be tricky to implement.

### Implementation

The majority of my time was spent developing the JavaScript logic to build and handle the game logic. In HTML, I started off with 20 "row" divs each containing 10 "column" divs. This HTML represents what the user actually sees. The JavaScript logic was represented with a 20x10 nested array of booleans. Everything in the game is manipulated within that 20x10 nested array before it is translated to the 20 x 10 set of divs. I later changed this boolean array to an integer array where 0 would still represent a blank unit, and numbers 1, 2, 3 etc would represent different colors depending on the shapes. Changing over to this color represented array was fairly easy as I was still able to use the same truthy/falsey logic that was already there.

Once I could reliably translate my nested array of values to "painted" divs on the HTML document, I started working on making puzzle pieces. There's actually only ever **one** puzzle piece being handled by the game at any point. This puzzle piece is represented by an array of 4 coordinates. A straight line would look like [[1,4],[2,4],[3,4],[4,4]]. I simulated movement by modifying each coordinate by 1 unit in whatever direction I needed. Getting a piece to appear on my board, and then start dropping, wasn't that hard.

The next step was figuring out collision detection and letting my game know to create a new puzzle piece and start over. Detecting left/right/floor collision wasn't too hard for basic movements. Once a collision with the **floor** is detected, whether it's the boundary of the game or an old puzzle piece, the game lets go of that current puzzle piece leaving its data stored in the game space array and then asks for a new puzzle piece.

Rotation was a bit tricky, but I figured it out after looking at some solutions to rotation online. Someone suggested translating raw coordinates to a fixed origin of (0,0) before doing the rotation math. That was brilliant, and made my rotation work. The hard part was detecting collision during a rotation movement. I struggled with this for a while and ended up implementing it in a wonky way. It's basically doing all the translation/rotation math, then checking for a collision with its new coordinates, and if collision=true, then it re-performs the same translation/rotation math except backwards. This is not pretty, but it was the only way I could get it to work.

Clearing lines ended up being pretty easy, although I definitely got lucky with getting the implementation right on my first try.

I should mention that the game is not very efficient. I am iterating through the entire game space array and translating those values to the nested divs in HTML for **EVERY.SINGLE.MOVEMENT**. It's basically refreshing the HTML divs all the time not unlike the way an actual computer monitor works.

### Installation

Just run the tetris.html file and you should get the game running.

### Things I'm not happy with

The core game was more or less working by the end of Monday. I spent the rest of my time slowly adding in additional features and I am **VERY** happy with how it turned out. With that said, here is a list of stuff I wish I had implemented in no particular order:

1. Better/more styling, a more responsive design, basically it should be prettier
2. Pause button
3. Mute button (I did attempt to do this, but ran into hurdles)
4. Speed up feature. The difficulty should ramp up as you clear more lines, but I couldn't get this to work properly.
5. Display the next piece. Just didn't have time to position it properly.
6. The game doesn't quite handle rotation at the very top of the screen as well as it should. Most versions of Tetris allow you to rotate the block before you even see it. Mine just prevents any type of clipping at the top of the screen. I could have implemented this by increasing the game space array by 2 or 4 invisible rows, but I didn't have the will to lol.
7. **IT SHOULD LOOK A LOT BETTER THAN THIS**

There's more stuff I'm forgetting.

### Anyways...

I'm really pleased with how this project turned out. I learned a ton and gained some valuable experience banging on this project for a week. I hope you enjoy the game and its development as much as I enjoyed making it!

### Extras

Mock-up made with Balsamiq
![Wireframe](http://i.imgur.com/boxHZLLl.png "Wireframe")
