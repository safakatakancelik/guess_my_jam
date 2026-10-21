// Curated catalogue: one "Title|Artist" per line, 50 per genre.

export interface Song {
  id: string
  title: string
  artist: string
  genre: GenreId
}

export type GenreId = 'jazz' | 'edm' | 'funk' | 'rnb' | 'soul' | 'rock' | 'hiphop'

export const GENRES: { id: GenreId; label: string; emoji: string }[] = [
  { id: 'jazz', label: 'Jazz', emoji: '🎷' },
  { id: 'edm', label: 'EDM', emoji: '🎛️' },
  { id: 'funk', label: 'Funk', emoji: '🕺' },
  { id: 'rnb', label: 'R&B', emoji: '💜' },
  { id: 'soul', label: 'Soul', emoji: '🔥' },
  { id: 'rock', label: 'Rock', emoji: '🎸' },
  { id: 'hiphop', label: 'Hip-Hop', emoji: '🎤' },
]

const RAW: Record<GenreId, string> = {
  jazz: `
Take Five|Dave Brubeck Quartet
So What|Miles Davis
Autumn Leaves|Cannonball Adderley
Summertime|Ella Fitzgerald & Louis Armstrong
'Round Midnight|Thelonious Monk
My Favorite Things|John Coltrane
Fly Me to the Moon|Frank Sinatra
All the Things You Are|Ella Fitzgerald
Body and Soul|Coleman Hawkins
Take the "A" Train|Duke Ellington
Blue in Green|Miles Davis
Moanin'|Art Blakey & The Jazz Messengers
Song for My Father|Horace Silver
Watermelon Man|Herbie Hancock
Cantaloupe Island|Herbie Hancock
Giant Steps|John Coltrane
A Love Supreme, Pt. I – Acknowledgement|John Coltrane
Naima|John Coltrane
In a Sentimental Mood|Duke Ellington & John Coltrane
Strange Fruit|Billie Holiday
What a Wonderful World|Louis Armstrong
Feeling Good|Nina Simone
My Funny Valentine|Chet Baker
The Girl from Ipanema|Stan Getz & João Gilberto
Sing, Sing, Sing|Benny Goodman
In the Mood|Glenn Miller
Mercy, Mercy, Mercy|Cannonball Adderley
The Sidewinder|Lee Morgan
Footprints|Wayne Shorter
Maiden Voyage|Herbie Hancock
Birdland|Weather Report
Spain|Chick Corea
Blue Train|John Coltrane
Freddie Freeloader|Miles Davis
Goodbye Pork Pie Hat|Charles Mingus
Better Git It in Your Soul|Charles Mingus
Waltz for Debby|Bill Evans
Peace Piece|Bill Evans
Straight, No Chaser|Thelonious Monk
Misty|Erroll Garner
St. Thomas|Sonny Rollins
Blue Bossa|Joe Henderson
Señor Blues|Horace Silver
Lullaby of Birdland|Sarah Vaughan
Cry Me a River|Julie London
Don't Know Why|Norah Jones
La Vie en Rose|Louis Armstrong
Ain't Misbehavin'|Fats Waller
A Night in Tunisia|Dizzy Gillespie
Chameleon|Herbie Hancock`,
  edm: `
Levels|Avicii
Wake Me Up|Avicii
Titanium|David Guetta ft. Sia
Animals|Martin Garrix
Clarity|Zedd ft. Foxes
Don't You Worry Child|Swedish House Mafia
One More Time|Daft Punk
Strobe|deadmau5
Ghosts 'n' Stuff|deadmau5
Scary Monsters and Nice Sprites|Skrillex
Bangarang|Skrillex
Lean On|Major Lazer & DJ Snake
Turn Down for What|DJ Snake & Lil Jon
Where Are Ü Now|Jack Ü ft. Justin Bieber
Summer|Calvin Harris
Feel So Close|Calvin Harris
This Is What You Came For|Calvin Harris ft. Rihanna
Latch|Disclosure ft. Sam Smith
Language|Porter Robinson
Shelter|Porter Robinson & Madeon
Opus|Eric Prydz
Sandstorm|Darude
Insomnia|Faithless
Children|Robert Miles
Satisfaction|Benny Benassi
Around the World|Daft Punk
Harder, Better, Faster, Stronger|Daft Punk
Silence|Delerium ft. Sarah McLachlan
Adagio for Strings|Tiësto
Red Lights|Tiësto
Something Just Like This|The Chainsmokers & Coldplay
Closer|The Chainsmokers ft. Halsey
Faded|Alan Walker
Alone|Marshmello
Happier|Marshmello & Bastille
Spectrum|Zedd ft. Matthew Koma
The Middle|Zedd, Maren Morris & Grey
Cola|CamelPhat & Elderbrook
Innerbloom|RÜFÜS DU SOL
Greyhound|Swedish House Mafia
Rather Be|Clean Bandit ft. Jess Glynne
Cinema (Skrillex Remix)|Benny Benassi
Hey Brother|Avicii
Breathe|The Prodigy
Firestarter|The Prodigy
Born Slippy .NUXX|Underworld
Block Rockin' Beats|The Chemical Brothers
Galvanize|The Chemical Brothers
Praise You|Fatboy Slim
Losing It|Fisher`,
  funk: `
Get Up (I Feel Like Being a) Sex Machine|James Brown
Papa's Got a Brand New Bag|James Brown
I Got You (I Feel Good)|James Brown
Give Up the Funk (Tear the Roof off the Sucker)|Parliament
Flash Light|Parliament
One Nation Under a Groove|Funkadelic
Atomic Dog|George Clinton
Superstition|Stevie Wonder
Higher Ground|Stevie Wonder
Brick House|Commodores
Le Freak|Chic
Good Times|Chic
Celebration|Kool & The Gang
Jungle Boogie|Kool & The Gang
Get Down On It|Kool & The Gang
September|Earth, Wind & Fire
Boogie Wonderland|Earth, Wind & Fire
Let's Groove|Earth, Wind & Fire
Play That Funky Music|Wild Cherry
Thank You (Falettinme Be Mice Elf Agin)|Sly & The Family Stone
Everyday People|Sly & The Family Stone
Pick Up the Pieces|Average White Band
Cissy Strut|The Meters
Why Can't We Be Friends?|War
Low Rider|War
Fire|Ohio Players
Love Rollercoaster|Ohio Players
Give It to Me Baby|Rick James
Super Freak|Rick James
Kiss|Prince
1999|Prince
Uptown Funk|Mark Ronson ft. Bruno Mars
Get Lucky|Daft Punk ft. Pharrell Williams
Treasure|Bruno Mars
Canned Heat|Jamiroquai
Virtual Insanity|Jamiroquai
Cosmic Girl|Jamiroquai
Ladies' Night|Kool & The Gang
Bustin' Loose|Chuck Brown
Car Wash|Rose Royce
Got to Give It Up|Marvin Gaye
Word Up!|Cameo
Candy|Cameo
Shining Star|Earth, Wind & Fire
Tell Me Something Good|Rufus & Chaka Khan
Ain't Nobody|Rufus & Chaka Khan
Mr. Big Stuff|Jean Knight
Funkytown|Lipps Inc.
Don't Stop 'Til You Get Enough|Michael Jackson
Cold Sweat|James Brown`,
  rnb: `
No Scrubs|TLC
Waterfalls|TLC
Crazy in Love|Beyoncé ft. Jay-Z
Say My Name|Destiny's Child
Yeah!|Usher ft. Lil Jon & Ludacris
U Got It Bad|Usher
Burn|Usher
No Diggity|Blackstreet ft. Dr. Dre
Pony|Ginuwine
Fallin'|Alicia Keys
If I Ain't Got You|Alicia Keys
No One|Alicia Keys
Family Affair|Mary J. Blige
Real Love|Mary J. Blige
Doo Wop (That Thing)|Lauryn Hill
Untitled (How Does It Feel)|D'Angelo
On & On|Erykah Badu
Let Me Love You|Mario
So Sick|Ne-Yo
Miss You|Aaliyah
Try Again|Aaliyah
Are You That Somebody|Aaliyah
Thinkin Bout You|Frank Ocean
Pink + White|Frank Ocean
Nights|Frank Ocean
The Hills|The Weeknd
Blinding Lights|The Weeknd
Wicked Games|The Weeknd
Kill Bill|SZA
Good Days|SZA
Snooze|SZA
Leave the Door Open|Silk Sonic
Best Part|Daniel Caesar ft. H.E.R.
Get You|Daniel Caesar ft. Kali Uchis
Focus|H.E.R.
Location|Khalid
Adorn|Miguel
Sure Thing|Miguel
Exchange|Bryson Tiller
Ex-Factor|Lauryn Hill
Love on Top|Beyoncé
Drunk in Love|Beyoncé ft. Jay-Z
Kiss It Better|Rihanna
Umbrella|Rihanna ft. Jay-Z
Rock with You|Michael Jackson
Cater 2 U|Destiny's Child
Boo'd Up|Ella Mai
We Belong Together|Mariah Carey
Water|Tyla
Redbone|Childish Gambino`,
  soul: `
Respect|Aretha Franklin
(You Make Me Feel Like) A Natural Woman|Aretha Franklin
Chain of Fools|Aretha Franklin
What's Going On|Marvin Gaye
Let's Get It On|Marvin Gaye
Ain't No Mountain High Enough|Marvin Gaye & Tammi Terrell
I Heard It Through the Grapevine|Marvin Gaye
(Sittin' On) The Dock of the Bay|Otis Redding
Try a Little Tenderness|Otis Redding
A Change Is Gonna Come|Sam Cooke
Bring It On Home to Me|Sam Cooke
Stand by Me|Ben E. King
My Girl|The Temptations
Ain't Too Proud to Beg|The Temptations
Papa Was a Rollin' Stone|The Temptations
Lean on Me|Bill Withers
Ain't No Sunshine|Bill Withers
Lovely Day|Bill Withers
Let's Stay Together|Al Green
Tired of Being Alone|Al Green
I'll Take You There|The Staple Singers
Midnight Train to Georgia|Gladys Knight & the Pips
Signed, Sealed, Delivered I'm Yours|Stevie Wonder
Isn't She Lovely|Stevie Wonder
The Tracks of My Tears|Smokey Robinson & The Miracles
The Tears of a Clown|Smokey Robinson & The Miracles
Soul Man|Sam & Dave
Hold On, I'm Comin'|Sam & Dave
In the Midnight Hour|Wilson Pickett
Mustang Sally|Wilson Pickett
I Put a Spell on You|Nina Simone
At Last|Etta James
I'd Rather Go Blind|Etta James
Move On Up|Curtis Mayfield
People Get Ready|The Impressions
Rescue Me|Fontella Bass
Me and Mrs. Jones|Billy Paul
Love Train|The O'Jays
Lovin' You|Minnie Riperton
Killing Me Softly with His Song|Roberta Flack
Back to Black|Amy Winehouse
Rehab|Amy Winehouse
Valerie|Mark Ronson ft. Amy Winehouse
Coming Home|Leon Bridges
Crazy|Gnarls Barkley
Rolling in the Deep|Adele
It's a Man's Man's Man's World|James Brown
Reach Out I'll Be There|Four Tops
I Can't Help Myself (Sugar Pie Honey Bunch)|Four Tops
Mercy|Duffy`,
  rock: `
Bohemian Rhapsody|Queen
Stairway to Heaven|Led Zeppelin
Hotel California|Eagles
Smells Like Teen Spirit|Nirvana
Sweet Child O' Mine|Guns N' Roses
Back in Black|AC/DC
Highway to Hell|AC/DC
Comfortably Numb|Pink Floyd
Wish You Were Here|Pink Floyd
(I Can't Get No) Satisfaction|The Rolling Stones
Paint It Black|The Rolling Stones
Gimme Shelter|The Rolling Stones
Come Together|The Beatles
Hey Jude|The Beatles
Purple Haze|Jimi Hendrix
All Along the Watchtower|The Jimi Hendrix Experience
Baba O'Riley|The Who
Born to Run|Bruce Springsteen
Dream On|Aerosmith
Livin' on a Prayer|Bon Jovi
Don't Stop Believin'|Journey
Whole Lotta Love|Led Zeppelin
Kashmir|Led Zeppelin
Paranoid|Black Sabbath
Iron Man|Black Sabbath
Enter Sandman|Metallica
Nothing Else Matters|Metallica
Smoke on the Water|Deep Purple
Free Bird|Lynyrd Skynyrd
Sweet Home Alabama|Lynyrd Skynyrd
Under Pressure|Queen & David Bowie
"Heroes"|David Bowie
Mr. Brightside|The Killers
Seven Nation Army|The White Stripes
Last Nite|The Strokes
Do I Wanna Know?|Arctic Monkeys
505|Arctic Monkeys
Creep|Radiohead
Karma Police|Radiohead
Wonderwall|Oasis
Don't Look Back in Anger|Oasis
Everlong|Foo Fighters
Black Hole Sun|Soundgarden
Alive|Pearl Jam
Californication|Red Hot Chili Peppers
Under the Bridge|Red Hot Chili Peppers
Basket Case|Green Day
Boulevard of Broken Dreams|Green Day
Knights of Cydonia|Muse
Should I Stay or Should I Go|The Clash`,
  hiphop: `
Juicy|The Notorious B.I.G.
Hypnotize|The Notorious B.I.G.
California Love|2Pac ft. Dr. Dre
Changes|2Pac
Still D.R.E.|Dr. Dre ft. Snoop Dogg
Nuthin' but a "G" Thang|Dr. Dre ft. Snoop Dogg
Gin and Juice|Snoop Dogg
Lose Yourself|Eminem
The Real Slim Shady|Eminem
Stan|Eminem ft. Dido
N.Y. State of Mind|Nas
C.R.E.A.M.|Wu-Tang Clan
Protect Ya Neck|Wu-Tang Clan
Can I Kick It?|A Tribe Called Quest
Electric Relaxation|A Tribe Called Quest
Ms. Jackson|OutKast
Hey Ya!|OutKast
B.O.B.|OutKast
Gold Digger|Kanye West ft. Jamie Foxx
Stronger|Kanye West
Runaway|Kanye West ft. Pusha T
99 Problems|Jay-Z
Empire State of Mind|Jay-Z ft. Alicia Keys
Big Pimpin'|Jay-Z ft. UGK
HUMBLE.|Kendrick Lamar
Alright|Kendrick Lamar
Money Trees|Kendrick Lamar ft. Jay Rock
Not Like Us|Kendrick Lamar
God's Plan|Drake
Hotline Bling|Drake
Started from the Bottom|Drake
SICKO MODE|Travis Scott
Goosebumps|Travis Scott
Mask Off|Future
XO Tour Llif3|Lil Uzi Vert
In Da Club|50 Cent
Ruff Ryders' Anthem|DMX
Shook Ones, Pt. II|Mobb Deep
Rapper's Delight|The Sugarhill Gang
The Message|Grandmaster Flash & The Furious Five
Fight the Power|Public Enemy
It Was a Good Day|Ice Cube
Straight Outta Compton|N.W.A
Walk This Way|Run-DMC & Aerosmith
Intergalactic|Beastie Boys
Jump Around|House of Pain
Gangsta's Paradise|Coolio ft. L.V.
Flashing Lights|Kanye West
Super Bass|Nicki Minaj
Bodak Yellow|Cardi B`,
}

export const SONGS: Song[] = (Object.keys(RAW) as GenreId[]).flatMap((genre) =>
  RAW[genre]
    .trim()
    .split('\n')
    .map((line, i) => {
      const [title, artist] = line.split('|')
      return { id: `${genre}-${i}`, title: title.trim(), artist: artist.trim(), genre }
    }),
)

export const SONG_BY_ID: Record<string, Song> = Object.fromEntries(SONGS.map((s) => [s.id, s]))
