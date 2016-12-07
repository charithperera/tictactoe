# TIC TAC TOE / CONNECT SOMETHING

https://charithperera.github.io/tictactoe/

## Goal
My goal was to make an expandable and scalable game of tic tac toe that could be cutomised at run time with different options. I wanted it to be colour based so it's easy to pick up and see exactly what's going on without too much thinking

## Cool Tech
Not too much 'cool' tech going on here just basic HTML CSS & JavaScript. I started with a mobile first approach which made it really easy at the end to get working on mobile devices (works great on an actual mobile phone). Not too many advanced UI elements going on. The AI does work, although it's not the smartest.

## Angry Bits
Getting the AI to work was a pain in the ass. Also I couldn't decide how I wanted this game to look so I just said screw it it's black. Because I wanted a clean and simple UI I wanted to only ever render what was required for the user to interact at the time. So I didn't want all buttons and all text there when the user didn't need it. So that was a pain to have to think about what button should really be on screen and make it appear at the right time for the user.

## Lessons learned

Refactoring was a pain. I should have used a better object approach from the start. I had too many rogue functions at the global level when really they were game specific. Managed to refactor it in the end. Code could still be dryer. Also I should have made connect X from the start. Large scale tic tac toe just does not work.

## Future
More options and allow for a connect X variant to make large scale games much more enjoyable. Build better and more aggressive AI.
