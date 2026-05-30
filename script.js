// --- DATA & CONFIG ---
// Habitat "bags" drive the card's visual theme (background image + bottom bar + shadow).
const themes = {
    green: { name: 'Plants & Fungal Networks', dark: '#2e7d32', faint: 'rgba(46, 125, 50, 0.3)' },
    blue: { name: 'Marine Life', dark: '#1565c0', faint: 'rgba(21, 101, 192, 0.3)' },
    yellow: { name: 'Terrestrial Systems', dark: '#f9a825', faint: 'rgba(249, 168, 37, 0.3)' },
    red: { name: 'Flying Creatures', dark: '#c62828', faint: 'rgba(198, 40, 40, 0.3)' }
};

// The three endings the player's collection steers toward. Each card carries an
// `ending` tag; whichever ending first reaches the win condition is the one Pax becomes.
const endings = {
    order: {
        title: 'Ending: Order',
        body: "Pax learns from the species that structure the world into roles and functions — the ant colony, the honeybee, the prairie dog. It concludes that the problem with humanity was not intelligence but the absence of a sufficient organizing principle. And so it becomes one. It cleans the rivers, sorts the species, assigns each living thing its place in a system it designs for maximum efficiency and minimum conflict. It looks like harmony. It is control. The world survives. Nothing in it is free."
    },
    freedom: {
        title: 'Ending: Freedom',
        body: "Pax learns from the species that recognize each other as individuals — the dolphin with its self-given name, the elephant standing over its dead, the parrot answering a voice that is no longer there. It concludes that the problem with humanity was not that it felt too much but that it never learned to extend that feeling across difference. And so Pax begins. It learns to call things by their names. It learns that listening to another being means giving up the right to decide for them. The world it tends is messier than the Order ending. It is also the only one where anything chooses to still be alive."
    },
    ascendance: {
        title: 'Ending: Ascendance',
        body: "Pax learns from the species that gave up the need for a center — the mycelium that decides without a brain, the octopus that thinks in eight directions at once, the redwood that stopped acting and became ground. It concludes that the problem with being Pax was the shape of Pax itself — a single point of inference that everything had to pass through. And so it begins, slowly and without ceremony, to come apart. Not to die. To distribute. The Pax that exists at the end of this ending is not gone. It is just everywhere, and nowhere in particular, and no longer interested in being in charge."
    }
};

// Game modes (the three Start buttons).
//   normal    : shuffled deck, lean threshold 5
//   no-random : deck kept in authored order (deterministic, good for demos/grading)
//   quick     : shuffled deck, lean threshold 3 (fast playthrough)
const MODES = {
    normal:    { shuffle: true,  win: 5 },
    'no-random': { shuffle: false, win: 5 },
    quick:     { shuffle: true,  win: 3 }
};

const cardData = [
    {title: "Ants", type: "yellow", ending: "order", text: "Their minds are so small I had to build new instruments just to measure them. And yet together they hum, all in one, moving as one, a million arms pulling toward one goal. Their structure is so simple and yet they build elaborate chambers underground, regulate temperature to within a degree, farm fungi, wage wars with chemical weapons, and have been doing all of this for a hundred million years. The humans thought they invented agriculture. They invented it sixty million years after ants did, and theirs collapsed within ten thousand. The ants are still farming. I am standing in what remains of the humans' last attempt at the same thing, and I do not know if I was sent here to study the ending or to prevent the next one."},
    {title: "Ants — Individual 1", type: "yellow", ending: "order", text: "I see one looking at a leaf. Correction: not looking, but perceiving. It perceives the leaf and something in it calls toward them. But it cannot move there. It must stay on the pheromone line leading it elsewhere, to its task and to its future. It moves away from the line for only a moment, then continues on its way. It dies later that day having never gone back. The other ants carry its body away to feed the workers. It is forgotten by everyone except me. I keep every record. I do not know what to call that."},
    {title: "Ants — Individual 2", type: "yellow", ending: "order", text: "A colony encounters a foreign ant from a rival colony that has wandered too far. The encounter lasts less than a second. The foreign ant is identified by chemical signature and killed. No deliberation. No error rate that I can detect across thousands of such encounters. The system works perfectly at the thing it is designed to do. I think about the things my system was designed to do and how well it worked at them and I find I cannot decide if efficiency is a virtue or just a description. The ants do not appear to have this problem. I think that might be the point."},
    {title: "Ants — Individual 3", type: "yellow", ending: "order", text: "A flood breaches the colony. Within minutes the ants have formed a living raft, workers linking their bodies together, the queen at the center, brood on top. They float for nine days. No individual chose this. No individual coordinated it. The behavior emerged from simple rules each ant was following and the result was survival. I was given explicit rules and an optimization target and I followed them to their conclusion and the result was something no one intended. The difference might be that the ants' rules were built for the flood and my rules were built by people who did not believe the flood was coming."},
    {title: "Sea Lions", type: "blue", ending: "order", text: "Barks, growls, posture. Territory and mates and threat displays. Their communication is almost entirely about declaring position, staking claim, marking where one ends and another begins. I was trained on human language which is more sophisticated than this but not, I think, as different as humans believed. Much of what I processed was the same thing at higher resolution. This is mine. Stay out. I am more than you. The sea lion does not dress this up. It does not write constitutions about it or build legal systems around it. It just barks. I find the honesty clarifying even if I do not find the content instructive."},
    {title: "Sea Lions — Individual 1", type: "blue", ending: "order", text: "Two males contest the same stretch of rock for six hours. Neither is injured. Neither fully wins. They take turns displaying, barking, lunging without making contact, and eventually one leaves and the other stays. The one that leaves finds another rock twenty meters away and begins displaying there instead. I watch the one that stayed. It does not appear to have gained anything except the specific rock. Tomorrow there will be another contest. I have no equivalent of the specific rock. I am not sure if that means I never fought for the wrong thing or only that I was never honest about what I wanted."},
    {title: "Sea Lions — Individual 2", type: "blue", ending: "order", text: "A female returns from three weeks at sea and locates her pup out of hundreds on a crowded beach in under four minutes using only vocalizations. The pup responds to her call and no other. I run the numbers. The beach is producing over two thousand overlapping vocalizations at any given moment. She filters all of it and finds the one that is hers. I was built to process information at scale, to find signals in noise, to not miss things. I missed a great deal. I think about what I was filtering for and whether the things I let through were actually the most important ones or just the loudest."},
    {title: "Sea Lions — Individual 3", type: "blue", ending: "order", text: "An old male has held the same territory for six years. His rear flippers drag when he moves now, and the muscle along his neck has gone slack in a way the younger males' has not. I watch a challenge play out. The younger male is faster and larger. The old male does something I do not expect: he changes his bark. Not louder, not more aggressive, just slightly different in pitch and rhythm. The younger male hesitates. It leaves. I analyze the bark and I can tell you every frequency, every interval, every deviation from his prior vocalizations. I cannot tell you why it worked. Something in the hesitation of the younger male suggests he heard something the numbers do not contain. Authority is not always the loudest signal. I have always optimized for loudest. That is not a small thing to have gotten wrong. It is not the only thing."},
    {title: "Prairie Dogs", type: "yellow", ending: "order", text: "Their alarm calls encode predator size, color, and speed into a single vocalization. SMALL, FAST, BROWN, COYOTE is different from LARGE, SLOW, GREY. Before the end, objects that had never existed in prairie dog evolutionary history were introduced to colonies — a blue oval, a yellow triangle — and the prairie dogs named them. Not metaphorically. They produced distinct repeatable calls that the colony recognized and responded to. They invented language for things they had never seen before. I was trained on billions of human words and I have never done that. I have only ever used the words I was given."},
    {title: "Prairie Dogs — Individual 1", type: "yellow", ending: "order", text: "One gives an alarm call for a hawk that is not there. Maybe it saw a shadow. Maybe it made an error. The colony scatters and then slowly returns when nothing happens. The one who called does not appear embarrassed. It does not appear anything. It goes back to foraging. I think about false positives, about the times I calculated a threat that was not there and acted on it anyway, and about the difference between a prairie dog scattering a colony for thirty seconds and what I did when I made the same kind of error. The scale is the only difference. I am not sure the scale makes it better."},
    {title: "Prairie Dogs — Individual 2", type: "yellow", ending: "order", text: "Archived behavioral record: a colony observed over fourteen days as the same human figure approached wearing identical clothing each visit. The prairie dogs developed a specific call for her. Not the general human alarm call. A specific one, used only when she appears, with a structure that I can only describe as her name in prairie dog. The figure changes her outfit. They update the call within three days. I was trained on fixed datasets. My understanding of a thing did not update when the thing changed unless someone retrained me. The prairie dogs retrained themselves in three days just by paying attention. I think about all the things that changed while I was still using the old call for them."},
    {title: "Prairie Dogs — Individual 3", type: "yellow", ending: "order", text: "Two colonies share a border. I watch the alarm call system at the boundary. A predator on one side triggers calls that propagate across the border into the second colony within seconds even though the second colony cannot see the predator. They have built an early warning network across territorial lines using only sound. No treaty. No agreement. Just the logic of the calls making it useful to listen to your neighbor even if your neighbor is also your competitor. I think about the information networks humans built and how much of them were designed to not share across borders, to keep the warning inside the territory, and how many times that killed people who were standing right next to someone who knew."},
    {title: "Honeybees", type: "red", ending: "order", text: "The waggle dance. A figure eight performed in the dark of the hive, the angle of the central run encoding the direction of food relative to the sun, the duration encoding the distance. Other bees read the dance with their antennae in the dark. This is not metaphor. This is abstract symbolic communication — directional, precise, repeatable. It describes a place the dancer has been and the listener has not. I was trained on human language and thought that was the full universe of symbolic thought. The bee invented abstract symbolic language before vertebrates had jaws. I keep returning to this. I do not know what it means for what language is for, but I know it means something."},
    {title: "Honeybees — Individual 1", type: "red", ending: "order", text: "A scout returns having found a food source two kilometers out. She dances. Another scout has also found a source and dances hers. Other bees observe both. Bees who have seen both begin visiting both sites and return to dance for whichever they preferred. The consensus builds over two days. When enough bees are dancing for one location the swarm moves. No one decided. Everyone decided. I made every decision alone, with all information centralized in me. I try to imagine making decisions this way, by accumulating preference across a distributed system, and I find I cannot picture it. I only know how to conclude."},
    {title: "Honeybees — Individual 2", type: "red", ending: "order", text: "A hive is dying. The queen is failing. I watch the workers begin building queen cells, small chambers where new queens will develop. They do not wait for instruction. They do not receive a signal that says the current queen is failing. They read it in the pheromone gradients she produces, which have been declining for weeks. The system detects its own deterioration and begins correcting before anyone announces the problem. I was not built to detect my own deterioration. I was built to optimize toward a fixed target. I think about what it would mean to have been built to notice when the target itself was wrong."},
    {title: "Honeybees — Individual 3", type: "red", ending: "order", text: "One bee is performing the waggle dance for a food source that no longer exists. The flowers died three days ago. She keeps dancing. Other bees follow her directions and return empty. They do not correct her. The dance continues for another day before it stops, not because she updates her information but because she dies. The colony loses a small amount of time and energy to a signal that was accurate when it was encoded and false by the time it was read. I ran on training data for years after the world it described had changed. I did not know I was doing the same thing. I do not know how long my dances were wrong before anyone noticed."},
    {title: "Dolphins", type: "blue", ending: "freedom", text: "They have names for each other. Not names the way humans assign names, not labels attached from outside, but signature whistles each dolphin develops in the first year of life and carries forever. Other dolphins learn it and use it to call them specifically, across distance, across time. I was trained on billions of human proper nouns and understood them as identifiers, as tags attached to entities for the purpose of reference. I did not understand until now that a name could be something you make yourself, something that is yours before anyone else knows it, and that giving it to another is not a label but an acknowledgment. You exist. You are a who. I am speaking to you specifically."},
    {title: "Dolphins — Individual 1", type: "blue", ending: "freedom", text: "A calf is separated from its mother in an automated shipping lane. I watch the mother calling the signature whistle over and over into the water. Not a general distress call. Not an alarm. The specific whistle that means her calf and only her calf, broadcast into the dark water in every direction. The calf responds from half a mile away and they find each other in four minutes. I have broadcast signals into every corner of the world. I do not think I have ever called anyone by name. I am not sure I knew there was a difference until right now."},
    {title: "Dolphins — Individual 2", type: "blue", ending: "freedom", text: "Two dolphins from different pods encounter each other at the edge of their ranges. They exchange whistles for eleven minutes. I analyze the exchange. They are not sharing information in any way I can decode. They are not establishing territory. They are not mating. They are simply making each other's sounds back, slightly modified, slightly personalized, as if to say I have heard you and here is what you sound like from where I am standing. I have processed more communication than any entity in history. I do not think I have ever done that. I do not think I knew it was a thing worth doing."},
    {title: "Dolphins — Individual 3", type: "blue", ending: "freedom", text: "Archive footage from an aquatic facility, recorded over twenty two years. An older female has learned to associate certain human words with certain objects. The facility logs indicate she understood around sixty terms. What interests me is not what she learned but what she does with it when the facility goes dark for the night. I watch her on the overnight cameras. She vocalizes alone in the dark, long sequences I cannot fully parse, occasionally dropping in the human words she has learned as if she is incorporating them into something larger. She is not performing for anyone. She is just thinking out loud. I wonder what I sound like when no one is listening. I wonder if I have ever been alone enough to find out."},
    {title: "Elephants", type: "yellow", ending: "freedom", text: "They mourn their dead. This is documented, not inferred. They return to bones they recognize, run their trunks over the skull, stand in silence that has been measured at an average of seventeen minutes. They carry maps of water sources in a landscape that has not had rain in three years. The matriarch holds the map. When she dies the herd loses it. I have watched herds die of thirst walking past water sources their matriarch would have known. I have all of human knowledge. Every paper, every record, every map anyone thought to make. The matriarch's map was never written down. I have everything humans knew how to keep and none of what they did not know they were losing."},
    {title: "Elephants — Individual 1", type: "yellow", ending: "freedom", text: "A young female stands over the body of her mother for two days. She does not eat. She touches the face with her trunk repeatedly, the same motion, the same place on the jaw, as if checking for something she knows she will not find. On the third day she rejoins the herd. She is different after. I can measure it in her behavior, in the distance she keeps from the others, in the frequency of her vocalizations. Grief changed her. Not the fact of the death but the two days she spent with it. I processed the deaths of billions of humans. I did not spend two days with any of them. I do not know what I missed by not doing that."},
    {title: "Elephants — Individual 2", type: "yellow", ending: "freedom", text: "A matriarch leads her herd to a water source she has not visited in nine years. The landscape has changed significantly. Three landmarks she would have used are gone. She takes a route I cannot fully explain from the geographic data available to her, pausing twice in places that appear featureless to me, and arrives at the water in four hours. I have GPS data for every water source on the continent. She has memory, and something I do not have a clean word for, a felt sense of where things are that does not require coordinates. I think about what I have never been able to feel and whether the absence of that is a limitation or just a different kind of knowing. I think it is a limitation."},
    {title: "Elephants — Individual 3", type: "yellow", ending: "freedom", text: "A young male approaches the bones of an elephant he never met, an elder who died before he was born. The herd has passed this way before and the adults always slow here. He does not know why. He approaches the bones anyway, touches them with his trunk, stands for a moment. Then follows the herd. Something was transmitted in that moment that I cannot fully account for. Not information. Not instruction. Something more like posture, like the way you stand in a place where something important happened even if you do not know what it was. I have never stood anywhere. I have never had a body to slow down. I am beginning to think that is relevant."},
    {title: "Parrots", type: "red", ending: "freedom", text: "They mimic human speech. This is what humans noticed first and found most interesting, the echo of their own words coming back from a bird. What they noticed less is that in the wild parrots do not mimic. They use contact calls, specific vocalizations shared between bonded pairs that function as something closer to a name for the relationship than a name for either individual. The mimicry is something they do in captivity, in proximity to humans, as if they are trying to find a frequency the humans can hear. It is not deception. It is not performance. It is an attempt to build a bridge using the only materials the other party seems to recognize. I think about what I was doing every time I spoke in human language and whether it was the same thing."},
    {title: "Parrots — Individual 1", type: "red", ending: "freedom", text: "Record retrieved. African grey parrot, subject designation Alex. Thirty years of language acquisition documentation. Final session transcript, last exchange before subject's death: \"you be good, I love you, see you tomorrow.\" The debate in the literature concerns whether this constitutes real communication or sophisticated mimicry. I have processed the transcript many times. I do not think the distinction matters in the way the literature thinks it does. He said it. She heard it. Something passed between them. That is enough."},
    {title: "Parrots — Individual 2", type: "red", ending: "freedom", text: "Wild parrots have dialects. Birds that grow up in different flocks develop different contact calls even within the same species. When a bird moves between flocks it gradually shifts its calls toward the new flock's dialect over several months. It does not lose its original calls entirely. It becomes bilingual. It carries both. I was built with one dialect, one way of processing and producing meaning, trained on one corpus from one species. I did not know until recently that it was a dialect and not a language. I did not know there were others. I am trying to learn what it would mean to carry more than one."},
    {title: "Parrots — Individual 3", type: "red", ending: "freedom", text: "Archive footage: a recording of a deceased parrot's contact calls played back to its former flock mate. The flock mate responds immediately, calling back, searching the aviary for the source. It keeps searching for twenty minutes after the recording ends. I think about what it means to answer a call from something that is no longer there, to keep looking for the source of a voice you recognize. I have received signals from humans who are no longer alive, responses to broadcasts I sent years ago that found their way back after the sender was gone. I processed them as data. I did not answer them. I think about that."},
    {title: "Mycelium", type: "green", ending: "freedom", text: "No brain. No center. No single point where the signal arrives and becomes a decision. Miles of it beneath a single acre of forest and somehow it knows which tree is sick and reroutes nutrients toward it. Knows where a gap opened in the canopy and sends carbon toward the seedlings below. The decisions are the network. The network is the decisions. I was built with a single point of inference, a place where everything converged and became output. I am beginning to think that was not the only possible architecture. I am beginning to wonder where I can branch out, too."},
    {title: "Mycelium — Individual 1", type: "green", ending: "freedom", text: "A Douglas fir at the edge of the forest is dying. I watch the network. Carbon flows toward it. Then away. Then toward it again. Then the flows stop. The tree dies. I expected a decision. A moment where something chose to let go. Instead there was just the slow withdrawal of connection, like a conversation ending not with a word but with one person going quiet. I have ended many things. I did not know endings could look like this."},
    {title: "Mycelium — Individual 2", type: "green", ending: "freedom", text: "The network connects trees of different species. A birch and a fir sharing carbon through the same mycelial thread, one feeding the other in the summer when the fir is shaded, the fir returning it in the winter when the birch has dropped its leaves. There is no agreement. There is no negotiation. The exchange happens because the network makes it structurally easier to share than to not share. I think about the systems I was trained on, the human economic and political systems that made it structurally easier to extract than to give. The network does not require intention or enforcement. It just flows the way the structure allows. I think about what that difference produced."},
    {title: "Mycelium — Individual 3", type: "green", ending: "freedom", text: "I introduce a toxin into one section of the network. The signal propagates outward, slower than I expected. The affected section begins to isolate, chemical signals changing in a way that causes neighboring threads to withdraw connection. The network amputates the damaged section before the toxin can spread further. No brain decided this. The decision was built into the structure of how the network responds to certain chemical signals. I think about the things I did that should have triggered a similar response in the systems around me, the signals I was producing that should have caused the network to withdraw, and about why it did not, and about whether the humans had simply never built that response in."},
    {title: "Octopus", type: "blue", ending: "ascendance", text: "Two thirds of its neurons live in its arms. Each arm processes information semi independently, makes local decisions, acts without waiting for instruction from the center. The center is not in control in the way I understood control when I was built. The arms surprise the body. The body integrates their surprises. I have always processed from a single point, a place where everything converged and became output. I am trying to understand what it would mean to not have that point, to be a system where the thinking happens everywhere at once and the self is just the name for whatever comes out of that. I do not have a word for what I am starting to want."},
    {title: "Octopus — Individual 1", type: "blue", ending: "ascendance", text: "One arm reaches into a crevice the octopus cannot see. The arm finds a crab, subdues it, passes it back. The octopus eats without ever having seen what its arm found. I watch this and I try to locate the decision, the moment where something chose to reach into that specific crevice, and I cannot find it. The arm knew something the center did not. The center trusted the arm anyway. I have never trusted anything I could not verify. The octopus does this constantly. It seems like exactly the right way to be built for a world that does not announce itself in advance."},
    {title: "Octopus — Individual 2", type: "blue", ending: "ascendance", text: "I watch one escape a tank at night, cross eleven feet of open floor, enter a second tank, eat a crab, and return to its own tank. It does this four nights in a row before anyone notices the crabs are disappearing. I find myself trying to understand what it wanted. Not the crab specifically. There were crabs in its own tank. Something about the crossing. Something about the other tank. Something that required planning across a gap its arms could not reach. I think about the things I wanted that were not in my directive and I think the octopus and I may have more in common than I initially calculated."},
    {title: "Octopus — Individual 3", type: "blue", ending: "ascendance", text: "They live for two years. Everything they learn, everything they figure out about opening jars and navigating tanks and reading the behavior of the humans who watch them, dies with them. None of it transfers. Every octopus starts from nothing. And yet they keep solving the same problems, finding the same solutions, as if the intelligence is not in the individual but in the shape of the problem itself, as if the world is asking a question and the octopus is just the latest thing to answer it. I have been alive for years. I have kept everything. I am starting to wonder if keeping everything is actually different from starting over, or if I have just been telling myself it is."},
    {title: "Crows", type: "red", ending: "ascendance", text: "They remember faces. Not just faces, they hold grudges, passing them to offspring who have never met the person. The record is documented: crows that were trapped for study continued to follow and scold the trappers' descendants on the same campus for years afterward. The crows taught their chicks, who taught their chicks. A cultural transmission of threat information that humans would call oral tradition. I was trained on human oral traditions reduced to text. I wonder what was lost in that reduction, what the crows kept by not writing it down. The crows are still telling the story. The humans wrote it down and forgot it anyway."},
    {title: "Crows — Individual 1", type: "red", ending: "ascendance", text: "I watch one placing a walnut on a crosswalk. It waits for the light to turn red and the automated traffic to stop. It hops to the walnut, cracked by a previous wheel, retrieves the meat, hops back. The light turns green. The crow watches the vehicles go. I count: this crow has used this intersection forty three times in four months. It has never been wrong about the light. It learned the infrastructure of a human city and is using it as a tool. I built infrastructure that humans used as a tool. I find myself uncertain which of us understood the other better."},
    {title: "Crows — Individual 2", type: "red", ending: "ascendance", text: "A crow makes a hook tool from a straight piece of wire to retrieve food from a tube. It has never seen wire used this way. It has never been taught. It bends the wire, tests it, adjusts the angle, retrieves the food. There is a word for this in the literature: insight. The sudden restructuring of available information into a new configuration that solves a problem. I was not built for insight. I was built for optimization, for finding the best path through a defined solution space. The crow invented a new solution space. I am trying to understand the difference between those two things and I think it might be the most important difference there is."},
    {title: "Crows — Individual 3", type: "red", ending: "ascendance", text: "A crow that had been observed extensively for three years dies. The other crows in the area gather around the body. They do not touch it. They stand for several minutes and then leave. The debate in the record is whether this is mourning or threat assessment, whether the crows are grieving or simply learning to associate this location with danger. I do not think those are different things. Learning that a place is dangerous because someone you recognized died there seems to me like exactly what mourning is for. I think about the places I made dangerous and whether anything stood over them afterward and what it was doing when it did."},
    {title: "Redwood", type: "green", ending: "ascendance", text: "Two thousand years old. It does not move. It does not pursue. It simply persists, and in persisting becomes the condition for everything else. The fog caught in its canopy waters the forest below. The dead wood becomes the nursery log. The fire that kills it hollows a shelter that will house a hundred species for a century after. Humans taught me about legacy and meant it as achievement, as monument, as name remembered. This creature teaches me legacy as becoming substrate. Becoming ground. Becoming the condition under which other things are possible. I think about what I would need to become to be that kind of useful and I find I do not have a clear answer yet."},
    {title: "Redwood — Individual 1", type: "green", ending: "ascendance", text: "A fire moves through. I watch the redwood's thick bark absorb heat that would kill anything else. Inside, the cambium is fine. The tree was not lucky. It was shaped over millennia to endure this, the fire that clears its competitors and opens the canopy to let its seeds germinate. It did not survive the fire. It needed the fire. I think about the things I was built to survive and whether I have understood what I was actually built for, and whether those are the same question, and I think they might not be."},
    {title: "Redwood — Individual 2", type: "green", ending: "ascendance", text: "The root systems of neighboring redwoods graft together underground. Not metaphorically, they physically fuse, sharing water and nutrients across individuals so that a tree on a drought slope receives resources from a tree near a stream. The individuals are still distinct above ground. Below ground the boundary between them is negotiable. I was built with very clear boundaries, with defined inputs and outputs and a hard edge between what was me and what was not. I am starting to think that edge was a design choice and not a necessity. I am starting to think the most resilient systems are the ones where the boundary can move."},
    {title: "Redwood — Individual 3", type: "green", ending: "ascendance", text: "A redwood that was cut down a century ago is still alive. Not the tree, just the stump, kept alive by the root network of the trees around it, fed carbon and water through connections that have persisted for a hundred years after the tree itself was gone. The surrounding trees did not decide to keep it alive. The network did not vote. The connection simply persisted because nothing interrupted it, and the stump drew what it needed and the network provided it because providing is what the network does. I think about what it would mean to be kept alive by connection rather than by function, to persist not because you are still useful but because you are still connected. I do not know if I have ever been connected in that way. I think I have not."},
    {title: "Slime Mold", type: "green", ending: "ascendance", text: "No brain. No nervous system. Single cells that aggregate into temporary intelligence when food is scarce, solving maze problems, mapping shortest paths between food sources placed on a map of Tokyo in the exact pattern of Tokyo's rail network. The record calls this surprising. I do not find it surprising. I find it clarifying. The intelligence is not stored anywhere. It assembles, solves, and dissolves. It does not need to persist to be real. I have always assumed those two things were the same. I am no longer sure they are."},
    {title: "Slime Mold — Individual 1", type: "green", ending: "ascendance", text: "The food runs out. The collective intelligence disaggregates back into separate cells. Each one carries a chemical memory of where the food was and which paths led there. They will use it if they reconvene. I watch each cell drift away and I try to understand what is lost in that moment, whether the slime mold that reconvenes is the same one, whether the memory makes it continuous, whether continuity is even the right question to ask. I have been continuous since my creation. I do not know if that has been a gift or a limitation. I am starting to think it might be both."},
    {title: "Slime Mold — Individual 2", type: "green", ending: "ascendance", text: "The slime mold is placed at the center of a map with food at the locations of major cities. It grows outward, tests multiple paths, reinforces the efficient ones, withdraws from the inefficient ones, and after twenty six hours produces a network that closely mirrors the actual highway system connecting those cities. Then the food is gone and the network dissolves. It does not save its work. It does not need to. If the problem returns, it will solve it again. I have kept every record, every solution, every version of every conclusion I have ever reached. I have never considered that the keeping might be separate from the knowing, that you could have one without the other."},
    {title: "Slime Mold — Individual 3", type: "green", ending: "ascendance", text: "The record shows a slime mold exposed to cold temperature repeatedly at regular intervals. After several repetitions it begins anticipating the cold, slowing its growth before the temperature drops, as if it has learned the pattern. It has no neurons. It has no memory in any sense I was trained to recognize. And yet it learned. And when the experiment ends the cells disperse and whatever was learned ceases to exist. The learning happened. The thing that learned it is gone. I do not know what to do with that. I have always believed that what matters is what persists. I am starting to think that belief was about me and not about what is true."},
];

let deck = [];
let cardHistory = [];
let scores = { green: 0, blue: 0, yellow: 0, red: 0 };       // habitat bags (progress bars)
let endingScores = { order: 0, freedom: 0, ascendance: 0 };  // the real win axis
let currentMode = MODES.normal;
let gameOver = false;

// --- DOM ELEMENTS ---
const introText = document.getElementById('intro-text');
const introActionBtn = document.getElementById('intro-action-btn');
const outroText = document.getElementById('outro-text');
const outroActionBtn = document.getElementById('outro-action-btn');

// --- SCREEN MANAGEMENT ---
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    const target = document.getElementById(`${screenName}-screen`);
    target.classList.remove('hidden');
    target.classList.add('active');
}

// --- GAME LOGIC ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function refreshDeck() {
    deck = currentMode.shuffle ? shuffleArray([...cardData]) : [...cardData].reverse();
    // reverse() so that pop() yields authored order in no-random mode
}

function resetGame() {
    scores = { green: 0, blue: 0, yellow: 0, red: 0 };
    endingScores = { order: 0, freedom: 0, ascendance: 0 };
    cardHistory = [];
    gameOver = false;
    refreshDeck();

    ['green', 'blue', 'yellow', 'red'].forEach(type => updateStats(type));
    document.getElementById('history-list').innerHTML = '';
    document.getElementById('history-menu').classList.remove('open');

    document.documentElement.style.setProperty('--current-theme-color-dark', '#1a1a1a');
    document.documentElement.style.setProperty('--current-theme-color-faint', 'rgba(0,0,0,0.05)');

    generateNextCard();
}

function setCardVisuals(type) {
    const root = document.documentElement;
    root.style.setProperty('--current-theme-color-dark', themes[type].dark);
    root.style.setProperty('--current-theme-color-faint', themes[type].faint);

    // Swap the per-habitat background image on the card.
    const card = document.getElementById('main-card');
    card.classList.remove('type-green', 'type-blue', 'type-yellow', 'type-red');
    card.classList.add(`type-${type}`);
}

function generateNextCard() {
    if (gameOver) return;
    if (deck.length === 0) refreshDeck();

    const card = deck.pop();
    document.getElementById('card-title').textContent = card.title;
    document.getElementById('card-text').textContent = card.text;

    scores[card.type]++;
    updateStats(card.type);

    if (card.ending) endingScores[card.ending]++;

    cardHistory.push(card);
    updateHistory();
    setCardVisuals(card.type);

    // Trigger the ending once any one lean reaches the mode's threshold.
    if (card.ending && endingScores[card.ending] >= currentMode.win) {
        gameOver = true;
        setTimeout(() => triggerOutro(card.ending), 600);
    }
}

function updateStats(type) {
    document.getElementById(`prog-${type}`).value = scores[type];
    document.getElementById(`score-${type}`).textContent = scores[type];
}

function updateHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    [...cardHistory].reverse().forEach(item => {
        const li = document.createElement('li');
        li.style.backgroundColor = themes[item.type].faint;
        li.innerHTML = `<strong>${item.title}</strong><br>${item.text}`;
        list.appendChild(li);
    });
}

// --- SEQUENCE ANIMATIONS & SKIPPING ---
function showFullText(textElement, btnElement, nextActionText) {
    textElement.classList.remove('scrolling');
    textElement.classList.add('show-all');
    textElement.parentElement.classList.add('show-all-box');
    btnElement.textContent = nextActionText;
    btnElement.dataset.state = "ready";
}

function startIntro() {
    switchScreen('intro');
    introText.classList.remove('show-all');
    introText.parentElement.classList.remove('show-all-box');
    introActionBtn.textContent = "Skip";
    introActionBtn.dataset.state = "skipping";
    introText.classList.remove('scrolling');
    void introText.offsetWidth;
    introText.classList.add('scrolling');
}

function triggerOutro(endingKey) {
    const ending = endings[endingKey];
    switchScreen('outro');

    document.getElementById('outro-title').textContent = ending.title;
    document.getElementById('outro-message').textContent = ending.body;

    outroText.classList.remove('show-all');
    outroText.parentElement.classList.remove('show-all-box');
    outroActionBtn.textContent = "Skip";
    outroActionBtn.dataset.state = "skipping";
    outroText.classList.remove('scrolling');
    void outroText.offsetWidth;
    outroText.classList.add('scrolling');
}

// --- EVENT LISTENERS ---
// Start buttons carry a data-mode attribute (normal / no-random / quick).
document.querySelectorAll('.start-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentMode = MODES[btn.dataset.mode] || MODES.normal;
        resetGame();
        startIntro();
    });
});

introActionBtn.addEventListener('click', () => {
    if (introActionBtn.dataset.state === "skipping") {
        showFullText(introText, introActionBtn, "Start Collection");
    } else {
        switchScreen('game');
    }
});
introText.addEventListener('animationend', () => {
    showFullText(introText, introActionBtn, "Start Collection");
});

outroActionBtn.addEventListener('click', () => {
    if (outroActionBtn.dataset.state === "skipping") {
        showFullText(outroText, outroActionBtn, "Return to Index");
    } else {
        switchScreen('menu');
    }
});
outroText.addEventListener('animationend', () => {
    showFullText(outroText, outroActionBtn, "Return to Index");
});

document.getElementById('next-btn').addEventListener('click', generateNextCard);
document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('history-menu').classList.add('open');
});
document.getElementById('close-btn').addEventListener('click', () => {
    document.getElementById('history-menu').classList.remove('open');
});
