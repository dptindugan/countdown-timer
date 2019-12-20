# countdown-timer

countdown timer on that is created with react hooks and one attempt to recreate app with redux.

COUNTDOWN TIMER with HOOKS
-- This timer app start counting down on click of the start button
and register the start time to the database creates a logging where
its field is named startTime
-- it uses .then() function get a promise from the server to get the logging ID
and set it as timeLogId.

    -- on click of the button it stops the timer and updates the logging on the database that is targeted with the timeLogId and sets its field or property called stopTime

    -- it also logs the stop time on click reset button, restore the timer to back to 2mins.

    -- the delete button of loggings table will not appear until once the current logging is stopped or reseted.

TO RUN THE APP

TO RUN THE SERVER
from the root folder open the server folder.
./server
and in the console run

with node package manager

\$ npm install

it will install all the dependencies and after installing run

with node package manager

\$ node

and will start the server

TO RUN THE CLIENT
open a new console
open the client folder from the countdownMadeWithHooks
./countdownMadeWithHooks
and in the console run

with node package manager

\$npm install
to install the all devepencies then

\$npm start
to run the react app.

COUNTDOWN TIMER with REDUX
-- does everything that the COUNTDOWN TIMER with HOOKS the difference is to states are managed with redux.

TO RUN THE APP

TO RUN THE SERVER
\*note that if you already run installed the server dependecies
and the is running server for the CountDownTimerWithHooks you don't need to
do part.

from the root folder open the server folder.
./server
and in the console run

with node package manager

\$ npm install

it will install all the dependencies and after installing run

with node package manager

\$ node

and will start the server

TO RUN THE CLIENT
on a new console
open the client folder from the countdownMadeWithRedux
./countdownMadeWithRedux
and in the console run

with node package manager

\$npm install
to install the all devepencies then

\$npm start
to run the react app.
