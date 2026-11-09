/* Midterm 2 notes, terms for both midterms, and the Midterm 2 outline.
   Written from the study guide. Examples use made-up classes (Ball, Dog, Score),
   not class or lab code. */
window.CS300 = window.CS300 || {};

(function () {
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function code(src) { return '<pre class="code"><code class="language-java">' + esc(src.replace(/^\n+|\s+$/g, "")) + "</code></pre>"; }
  function warn(html) { return '<div class="callout warn"><span class="label">Don’t confuse</span><div>' + html + "</div></div>"; }
  function note(label, html) { return '<div class="callout note"><span class="label">' + label + "</span><div>" + html + "</div></div>"; }
  function table(head, rows, cls) {
    return '<div class="table-wrap"><table' + (cls ? ' class="' + cls + '"' : "") + "><thead><tr>" +
      head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>";
  }

  var T = {
    m1: "var", m2: "Static vs non-static", m3: "Java keywords", m4: "Null-pointer exceptions",
    m5: "try/catch", m6: "Polymorphism", m7: "Nested classes", m8: "Lambdas & method references",
    m9: "Streams, Predicate & Consumer", m10: "Method chaining", m11: "Concurrent modification",
    m12: "The seven design patterns", m13: "Activity lifecycle", m14: "Android classes & Java vs Android",
    m15: "Handler repeated events", m16: "Intersection math", m17: "Reading code"
  };
  Object.keys(T).forEach(function (k) { CS300.topics[k] = T[k]; });

  CS300.sections = CS300.sections.concat([
    { id: "m1", num: "1", title: "When you can and cannot use var", html:
      "<p><strong>The rule:</strong> <code>var</code> works only on a <strong>local variable that gets a value on the same line</strong>. The compiler reads that value and works out the type. The type then stays fixed; <code>var</code> only saves typing. It does not make Java work like JavaScript.</p>" +
      code("var score = 5;                     // int\nvar names = new ArrayList<String>(); // ArrayList<String>\nvar nums = new int[]{1, 2};        // int[]\nfor (var i = 0; i < 3; i++) { }    // loop counter\nfor (var n : names) { }            // for-each variable") +
      "<h3>Where it fails</h3>" +
      table(["Code", "Why it fails"], [
        ["<code>var f = 5;</code> as a field", "Fields are not local variables."],
        ["<code>void m(var p) { }</code>", "Parameters need a type callers can see."],
        ["<code>var m() { return 5; }</code>", "Return types need to be written."],
        ["<code>var a;</code>", "No value, so nothing to work out the type from."],
        ["<code>var a = null;</code>", "<code>null</code> has no usable type."],
        ["<code>var a = {1, 2};</code>", "Bare braces need a declared array type. Write <code>new int[]{1, 2}</code>."],
        ["<code>var r = () -> 5;</code>", "A lambda needs a known functional interface."],
        ["<code>var a = 5; a = \"x\";</code>", "<code>a</code> is an int forever."],
        ["<code>catch (var e)</code>", "A catch must name the exception type."]
      ], "plain") +
      note("Small exception", "Lambda parameters may use it: <code>(var a, var b) -> a + b</code>.") },

    { id: "m2", num: "2", title: "Static vs non-static", html:
      table(["", "Static: one per class", "Non-static: one per object"], [
        ["Field", "One shared copy. Change it once and every object sees it.", "Each object has its own copy."],
        ["Method", "Called on the class: <code>Math.random()</code>. Has no <code>this</code>.", "Called on an object: <code>ball.move()</code>. Has <code>this</code>."]
      ]) +
      code("class Ball {\n    int x;               // every Ball has its own x\n    static int count;    // all Balls share one count\n\n    Ball() { count++; }  // each new Ball adds to the shared count\n\n    static int total() { return count; }  // OK: static uses static\n    static void bad()  { x = 1; }         // ERROR: which Ball's x?\n    void move()        { x++; count++; }  // OK: instance uses both\n}") +
      "<h3>The two guide questions</h3>" +
      "<ul><li><strong>Which methods can access static fields?</strong> Both static and non-static methods.</li>" +
      "<li><strong>Which fields can static methods access?</strong> Directly, only static fields. A static method reaches an instance field only through an object, like <code>someBall.x</code>.</li></ul>" +
      "<p><strong>The reason:</strong> a static method has no <code>this</code>, so it cannot know which object's field you mean.</p>" },

    { id: "m3", num: "3", title: "Common Java keywords", html:
      table(["Keyword", "Meaning", "Use it when"], [
        ["<code>public</code>", "Any class can use it.", "It's part of what others should call."],
        ["<code>protected</code>", "Same package, plus subclasses.", "Children need it, but outsiders don't."],
        ["(none)", "Package-private: same package only.", "Only nearby classes need it."],
        ["<code>private</code>", "Only inside this class, including its nested classes.", "It's an internal detail. The default choice for fields."],
        ["<code>static</code>", "Belongs to the class, not to one object.", "Shared values, helpers that need no object."],
        ["<code>final</code>", "Variable: cannot be reassigned. Method: cannot be overridden. Class: cannot be extended.", "A value or design must not change."],
        ["<code>abstract</code>", "Class: cannot use <code>new</code> on it. Method: no body, and a concrete subclass must write it.", "A parent shares code but leaves steps open."],
        ["<code>interface</code>", "A contract of methods. A class can implement many.", "Unrelated classes should share a capability."]
      ]) +
      warn("<code>final</code> on an object variable stops reassigning the variable, not changing the object. <code>final List&lt;Integer&gt; a = new ArrayList&lt;&gt;(); a.add(1);</code> compiles.") },

    { id: "m4", num: "4", title: "Finding and fixing a null-pointer exception", html:
      "<p><strong>What it is:</strong> you used a dot on a variable that points to no object.</p>" +
      "<p><strong>How to find it:</strong> read the crash line, look at the variable before the dot, and ask where it should have received <code>new</code>.</p>" +
      "<p><strong>How to fix it:</strong> create the object first. If it can legitimately be missing, check for null before using it.</p>" +
      code("// 1. Declared, never created\nclass Ball {\n    private Paint p;\n    Ball() { p.setColor(1); }   // crash: p is null\n}                               // fix: p = new Paint(); first\n\n// 2. A local variable hides the field\nclass Ball {\n    private Paint p;\n    Ball() { Paint p = new Paint(); } // makes a LOCAL p; the field stays null\n}                                     // fix: p = new Paint();\n\n// 3. A method can return null\nBall b = findBall(x, y);\nb.move();                         // crash if nothing was found\nif (b != null) { b.move(); }      // fix") +
      warn("Case 2 is the favorite trap: the code looks like it initializes the field, but the type name in front makes a brand-new local variable.") +
      note("Array version", "<code>Ball[] balls = new Ball[10];</code> makes 10 empty slots. Each slot is null until you assign a Ball to it.") },

    { id: "m5", num: "5", title: "How to write a try/catch block", html:
      code("int n;\ntry {\n    n = Integer.parseInt(text);      // code that might fail\n    System.out.println(\"ok\");        // skipped if the line above throws\n} catch (NumberFormatException e) {  // runs only for this exception type\n    n = 0;\n} finally {                          // optional: runs either way\n    System.out.println(\"done\");\n}") +
      "<ul><li>When a line throws, Java skips the rest of <code>try</code> and jumps to the matching <code>catch</code>.</li>" +
      "<li>With several catches, list specific types first and <code>Exception</code> last.</li>" +
      "<li>Declare a variable outside <code>try</code> if you need it after the block. Variables declared inside exist only inside.</li>" +
      "<li>Don't catch a null pointer to hide it. Fix the cause.</li></ul>" },

    { id: "m6", num: "6", title: "Recognizing polymorphism", html:
      "<p><strong>Look for:</strong> a variable whose declared type is a parent class or interface, holding a child object, followed by a method call. The <strong>real object</strong> decides which code runs.</p>" +
      code("class Animal { void speak() { System.out.println(\"...\"); } }\nclass Cat extends Animal { @Override void speak() { System.out.println(\"Meow\"); } }\nclass Dog extends Animal { @Override void speak() { System.out.println(\"Woof\"); } }\n\nAnimal a = new Cat();\na.speak();                 // Meow: the object is really a Cat\n\nfor (Animal x : List.of(new Cat(), new Dog())) {\n    x.speak();             // Meow, then Woof\n}") +
      "<p><strong>Other places you'll see it:</strong> <code>List&lt;String&gt; a = new ArrayList&lt;&gt;()</code>; passing a custom View to a method that takes a <code>View</code>; passing an Activity where a <code>Context</code> is expected; a loop calling an interface method on many kinds of objects.</p>" +
      warn("The variable's type decides which methods you may <em>call</em>. The object's type decides which version <em>runs</em>.") },

    { id: "m7", num: "7", title: "The five kinds of nested class", html:
      table(["Kind", "Written where", "Name?", "Can use the outer object's fields?"], [
        ["Inner class", "In the class body, no <code>static</code>", "Yes", "Yes. It's tied to one outer object."],
        ["Static nested", "In the class body, with <code>static</code>", "Yes", "No. Only outer static members, or through an object."],
        ["Local inner", "Inside a method", "Yes", "Yes in a non-static method, plus unchanged local variables."],
        ["Anonymous", "Inside an expression, right after <code>new</code>", "No", "Same as local. Made and used in one spot."],
        ["Lambda", "Inside an expression", "No", "Same as local. Only for functional interfaces, and not technically a class."]
      ]) +
      "<h3>All five doing a similar job</h3>" +
      code("class Game {\n    private int score;\n\n    class Inner implements Runnable {             // INNER\n        public void run() { score++; }\n    }\n    static class Nested {                         // STATIC NESTED\n        void run(Game g) { g.score++; }           // needs an object passed in\n    }\n    void start(Handler h) {\n        class Local implements Runnable {         // LOCAL\n            public void run() { score++; }\n        }\n        h.post(new Local());\n        h.post(new Runnable() {                   // ANONYMOUS\n            @Override public void run() { score++; }\n        });\n        h.post(() -> score++);                    // LAMBDA\n    }\n}") +
      "<h3>Creating them</h3>" +
      code("Game g = new Game();\nGame.Inner a = g.new Inner();        // inner needs an outer object\nGame.Nested b = new Game.Nested();   // static nested does not") +
      note("this", "Inside an anonymous class, <code>this</code> means the anonymous object. Inside a lambda, <code>this</code> means the enclosing object.") },

    { id: "m8", num: "8", title: "Lambdas and method references", html:
      "<p>A <strong>functional interface</strong> has exactly one abstract method. That's what makes a lambda possible: Java knows which method you are filling in.</p>" +
      "<h3>Rewrite an anonymous class as a lambda</h3>" +
      "<ol><li>Delete <code>new InterfaceName() {</code> and its closing <code>}</code>.</li><li>Delete <code>@Override</code>, <code>public</code>, the return type, and the method name.</li><li>Keep the parameters, add <code>-&gt;</code>, keep the body.</li><li>Optional: drop parameter types; drop <code>{ }</code> and <code>return</code> for one statement; drop parentheses for one untyped parameter.</li></ol>" +
      code("// BEFORE\nb.setOnClickListener(new View.OnClickListener() {\n    @Override\n    public void onClick(View v) {\n        count++;\n    }\n});\n\n// AFTER\nb.setOnClickListener(v -> count++);") +
      "<h3>Lambda syntax forms</h3>" +
      table(["Parameters", "Form"], [
        ["None", "<code>() -> go()</code>"],
        ["One", "<code>x -> x * 2</code> or <code>(x) -> x * 2</code>"],
        ["Two", "<code>(a, b) -> a + b</code>"],
        ["Several statements", "<code>x -> { log(x); return x * 2; }</code>"]
      ], "plain") +
      "<h3>Lambda vs method reference</h3>" +
      "<p>A method reference is a shorter lambda, usable when the lambda only calls one existing method with the same arguments.</p>" +
      table(["Lambda", "Method reference", "Kind"], [
        ["<code>x -> timer.add(x)</code>", "<code>timer::add</code>", "Method of one specific object"],
        ["<code>b -> b.move()</code>", "<code>Ball::move</code>", "Method called on each item"],
        ["<code>x -> Math.abs(x)</code>", "<code>Math::abs</code>", "Static method"],
        ["<code>() -> new ArrayList&lt;&gt;()</code>", "<code>ArrayList::new</code>", "Constructor"]
      ], "plain") +
      warn("<code>b -> b.draw(c)</code> cannot become <code>Ball::draw</code>, because it passes an extra value. A method reference has no parentheses: it names the method without calling it.") +
      warn("A lambda may read a local variable only if that variable never changes after it is set (effectively final). Fields have no such limit.") },

    { id: "m9", num: "9", title: "Streams, Predicate and Consumer", html:
      "<p>A <strong>stream</strong> is an assembly line for a collection. Start with <code>.stream()</code>, add steps, then finish with one end step. The original list doesn't change.</p>" +
      code("List<Ball> moving = balls.stream()      // start\n        .filter(b -> b.isMoving())      // keep only matches\n        .collect(Collectors.toList());  // END: gather into a new list\n\nlong n = balls.stream().filter(b -> b.isMoving()).count();      // END: how many\nint sum = balls.stream().mapToInt(b -> b.getScore()).sum();     // convert, END: add\nballs.stream().filter(b -> b.isMoving()).forEach(b -> b.stop()); // END: do this") +
      table(["Middle steps (return a stream)", "End steps", "On a List directly"], [
        ["<code>filter</code>, <code>map</code>, <code>mapToInt</code>", "<code>forEach</code>, <code>collect</code>, <code>count</code>, <code>sum</code>", "<code>list.forEach(...)</code>, <code>list.removeIf(...)</code>"]
      ], "plain") +
      "<h3>The two interfaces to know</h3>" +
      table(["Interface", "Its one method", "Job", "Goes in"], [
        ["<code>Predicate&lt;T&gt;</code>", "<code>boolean test(T t)</code>", "Answer yes or no about an item", "<code>filter</code>, <code>removeIf</code>"],
        ["<code>Consumer&lt;T&gt;</code>", "<code>void accept(T t)</code>", "Do something with an item, return nothing", "<code>forEach</code>"]
      ]) +
      code("Predicate<Ball> offScreen = b -> b.getY() > height;  // reusable test\nballs.removeIf(offScreen);\n\nConsumer<Ball> stopper = b -> b.stop();\nballs.forEach(stopper);") },

    { id: "m10", num: "10", title: "Method chaining", html:
      "<p><strong>What it is:</strong> calling several methods in one statement, each on the result of the last. <strong>How it works:</strong> each method returns the object, using <code>return this</code>. It's a technique, not an official design pattern.</p>" +
      "<h3>Convert a setter in two changes</h3>" +
      code("// TRADITIONAL\npublic void setAge(int a) {\n    age = a;\n}\n\n// CHAINABLE\npublic Pet setAge(int a) {   // 1. return type becomes the class\n    age = a;\n    return this;             // 2. return the current object\n}\n\n// Now this works:\nPet p = new Pet().setName(\"Rex\").setAge(3);") +
      warn("Chains don't always use <code>return this</code>. <code>text.trim().toUpperCase()</code> chains too, but each String method returns a <strong>new</strong> String.") },

    { id: "m11", num: "11", title: "Concurrent modification errors", html:
      "<p><strong>What:</strong> you add to or remove from a list while a for-each loop is walking through it. <strong>It doesn't require two threads.</strong> One thread can trigger it.</p>" +
      code("for (Ball b : balls) {\n    if (b.isDead()) balls.remove(b);   // ConcurrentModificationException\n}\n\n// Fix 1: collect first, remove after the loop\nList<Ball> doomed = new ArrayList<>();\nfor (Ball b : balls) { if (b.isDead()) doomed.add(b); }\nballs.removeAll(doomed);\n\n// Fix 2: the simplest\nballs.removeIf(b -> b.isDead());\n\n// Fix 3: when the change happens during someone else's loop, delay it\nview.post(() -> addBall());   // runs after the current loop ends") +
      warn("It's a hidden version of the same bug if a method called from inside the loop changes the list. Look for what the loop's calls do.") },

    { id: "m12", num: "12", title: "The seven design patterns", html:
      "<p>The guide names <strong>Strategy, Factory, Chain of Responsibility, Command, Builder, Observer, and Template Method</strong>. Method chaining, composition and lambdas are not design patterns.</p>" +
      table(["Pattern", "Idea", "How to recognize it", "Android example"], [
        ["Strategy", "Swap a behavior by swapping an object", "A field of an interface type that gets called and can be replaced", "Book: Duck has a FlyBehavior"],
        ["Factory", "A method makes the object for you", "A method returns a new object, used instead of <code>new</code>", "<code>BitmapFactory.decodeResource</code>, <code>Toast.makeText</code>"],
        ["Chain of Resp.", "A request passes along until someone handles it", "Each handler handles it or passes it on", "Touch: View, then Activity if the View returns false"],
        ["Command", "Pack a request into an object to run later", "An <code>execute()</code>-style object given to something that doesn't know what it does", "Closest: a Runnable given to <code>post</code>"],
        ["Builder", "Set up a complex object in steps, then build it", "A helper object, many setters, then <code>create()</code> or <code>build()</code>", "<code>AlertDialog.Builder</code>"],
        ["Observer", "One subject tells many subscribers", "A list of listeners, add and remove methods, a notify loop", "Click listeners; a timer with subscribers"],
        ["Template Method", "A parent fixes the steps; children fill them in", "You override hooks, and the parent decides when they run", "Activity lifecycle"]
      ]) +
      "<h3>How to implement each one</h3>" +
      code("// STRATEGY\ninterface Attack { void hit(); }\nclass Sword implements Attack { public void hit() { /* slash */ } }\nclass Hero {\n    private Attack a;\n    void setAttack(Attack x) { a = x; }   // swap at runtime\n    void fight() { a.hit(); }             // delegate\n}\n\n// SIMPLE FACTORY\nclass Pets {\n    static Pet make(String kind) {\n        if (kind.equals(\"cat\")) return new Cat();\n        return new Dog();\n    }\n}\n\n// CHAIN OF RESPONSIBILITY\nabstract class Handler {\n    Handler next;\n    void handle(String req) {\n        if (canHandle(req)) process(req);\n        else if (next != null) next.handle(req);\n    }\n    abstract boolean canHandle(String req);\n    abstract void process(String req);\n}\n\n// COMMAND\ninterface Command { void execute(); }\nclass LightOn implements Command {\n    private Light light;\n    LightOn(Light l) { light = l; }\n    public void execute() { light.on(); }\n}\nclass Remote {                       // knows nothing about lights\n    private Command c;\n    void setCommand(Command x) { c = x; }\n    void press() { c.execute(); }\n}\n\n// BUILDER\nclass Pizza {\n    private String size; private boolean cheese;\n    static class Builder {\n        private Pizza p = new Pizza();\n        Builder size(String s) { p.size = s; return this; }\n        Builder cheese() { p.cheese = true; return this; }\n        Pizza build() { return p; }\n    }\n}\nPizza p = new Pizza.Builder().size(\"L\").cheese().build();\n\n// OBSERVER\ninterface Listener { void onEvent(); }\nclass Subject {\n    private List<Listener> list = new ArrayList<>();\n    void add(Listener x) { list.add(x); }\n    void remove(Listener x) { list.remove(x); }\n    void tell() { for (Listener x : list) x.onEvent(); }\n}\n\n// TEMPLATE METHOD\nabstract class Game {\n    final void play() { setup(); run(); end(); }  // the fixed order\n    abstract void setup();                        // required steps\n    abstract void run();\n    void end() { }                                // a hook: optional\n}") +
      note("Bonus: Facade", "A simple method that hides complicated API calls, such as one small method that wraps the Preferences code. It's on the schedule but isn't on the Midterm 2 pattern list.") +
      note("Command", "Command is on the study guide but missing from the Nov 2 announcement's list of patterns learned so far. Know its definition and shape in case it appears.") },

    { id: "m13", num: "13", title: "The activity lifecycle", html:
      "<p><strong>Lifecycle methods:</strong> <code>onCreate</code>, <code>onStart</code>, <code>onResume</code>, <code>onPause</code>, <code>onStop</code>, <code>onRestart</code>, <code>onDestroy</code>.</p>" +
      "<p><strong>Design pattern:</strong> Template Method. Android controls the order, and you override the methods you care about. Those overridable methods are called <strong>hooks</strong>. Call <code>super</code> first in each.</p>" +
      table(["What happens", "Android calls, in order", "Typical code"], [
        ["Activity opens", "<code>onCreate → onStart → onResume</code>", "Build the screen; start music"],
        ["Gets backgrounded", "<code>onPause → onStop</code>", "Pause music. The Activity stays in memory."],
        ["Comes back", "<code>onRestart → onStart → onResume</code>", "Resume music"],
        ["Closes (<code>finish()</code>, Back)", "<code>onPause → onStop → onDestroy</code>", "Release the music player"]
      ]) +
      code("public class GameScreen extends Activity {\n    @Override protected void onPause() {\n        super.onPause();\n        music.pause();\n    }\n    @Override protected void onResume() {\n        super.onResume();\n        music.start();\n    }\n    @Override protected void onDestroy() {\n        super.onDestroy();\n        music.release();\n    }\n}") },

    { id: "m14", num: "14", title: "Android classes, and Java vs Android", html:
      table(["Class", "What it's for"], [
        ["<code>Activity</code>", "One screen of the app. Android creates it and runs its lifecycle."],
        ["<code>View</code>", "Something on screen. It draws itself in <code>onDraw</code> and receives touches in <code>onTouchEvent</code>."],
        ["<code>Handler</code>", "Schedules messages or work to run later. Used for repeating events."],
        ["<code>Bitmap</code>", "An image in memory: its pixels."],
        ["<code>Toast</code>", "A small popup message that disappears by itself. Needs <code>.show()</code>."],
        ["<code>Context</code>", "The app's connection to Android: resources and services. An Activity is a Context."],
        ["<code>Canvas</code>", "The drawing surface and commands: <code>drawLine</code>, <code>drawBitmap</code>. Android passes it to <code>onDraw</code>."],
        ["<code>Paint</code>", "The drawing style: color, line width, fill or stroke, text size."]
      ]) +
      "<h3>Regular Java vs Android</h3>" +
      table(["", "Regular Java", "Android"], [
        ["Starts at", "<code>public static void main</code>", "The launcher Activity named in the Manifest; Android calls <code>onCreate</code>"],
        ["In control", "Your code, top to bottom", "Android, calling your hooks when things happen"],
        ["Window, panel", "<code>JFrame</code>, <code>JPanel</code>", "<code>Activity</code>, <code>View</code>"],
        ["Drawing", "<code>paintComponent(Graphics)</code>", "<code>onDraw(Canvas)</code>"],
        ["Input", "Keyboard, mouse, <code>Scanner</code>", "Touch through <code>onTouchEvent(MotionEvent)</code>"],
        ["Messages", "<code>System.out.println</code>", "<code>Toast</code>, <code>Log.d</code>, <code>AlertDialog</code>"],
        ["Lifetime", "Ends when main ends", "Lifecycle: paused, stopped, destroyed by the system"]
      ]) +
      "<p><strong>Both share:</strong> the Java language, classes, inheritance, interfaces, polymorphism, patterns, collections, exceptions, lambdas and streams.</p>" },

    { id: "m15", num: "15", title: "Time-delayed repeated events with Handler", html:
      "<p><strong>The trick:</strong> handling a message schedules the next message, so it keeps repeating.</p>" +
      code("public class Ticker extends Handler {               // 1. extend Handler\n    public Ticker() {\n        super(Looper.getMainLooper());\n        sendMessageDelayed(obtainMessage(), 100);   // 2. start it off\n    }\n    @Override\n    public void handleMessage(Message m) {          // 3. Android calls this after the delay\n        // the repeating work goes here\n        sendMessageDelayed(obtainMessage(), 100);   // 4. schedule the next one\n    }\n}\n// Stop it: removeCallbacksAndMessages(null);") +
      "<p>The number is milliseconds, so 100 means about 10 times a second. To animate, change the positions and call <code>invalidate()</code> on the View, which asks Android to call <code>onDraw</code> again.</p>" +
      warn("<code>view.post(runnable)</code> is taught as launching a thread. Strictly, it queues the work to run later on the UI thread. Use the class wording on the exam, and know why it helps: the work waits until the current code finishes.") },

    { id: "m16", num: "16", title: "Intersection math", html:
      "<p><strong>On screens, y grows downward</strong>, so <code>top</code> is a smaller number than <code>bottom</code>.</p>" +
      code("// POINT in RECTANGLE: between left and right AND between top and bottom\nboolean inside = x >= r.left && x < r.right && y >= r.top && y < r.bottom;\n// Android: r.contains(x, y)\n\n// RECTANGLE overlaps RECTANGLE: each starts before the other ends, on both axes\nboolean hit = a.left < b.right && a.right > b.left\n           && a.top < b.bottom && a.bottom > b.top;\n// Android: RectF.intersects(a, b)") +
      "<h3>Worked example</h3>" +
      "<p>a = (left 0, top 0, right 10, bottom 10), b = (left 5, top 5, right 15, bottom 15).</p>" +
      "<ul><li><code>0 &lt; 15</code> yes, <code>10 &gt; 5</code> yes, <code>0 &lt; 15</code> yes, <code>10 &gt; 5</code> yes: they overlap.</li><li>Move b to left 20, right 30: <code>10 &gt; 20</code> is false, so no overlap. One false is enough.</li></ul>" },

    { id: "m17", num: "17", title: "How to read a code snippet", html:
      "<ol><li><strong>Find where it starts:</strong> usually <code>main</code> or the first line shown.</li><li><strong>Keep a small table</strong> of each variable's value and update it line by line.</li><li><strong>At <code>new</code>,</strong> run the constructor, parent constructor first.</li><li><strong>At a method call,</strong> ask what the object really is. That picks the version.</li><li><strong>In a loop,</strong> write the counter for each pass and check the end condition. <code>&lt;=</code> runs one more time than <code>&lt;</code>.</li><li><strong>Watch for traps:</strong> integer division, <code>==</code> on Strings, a local variable hiding a field, a String method's result being thrown away, a <code>break</code>, a static field being shared.</li></ol>" +
      note("Practice", "Use the Quiz tab and choose “What prints?” Every one of those answers was checked by running the code with Java.") }
  ]);

  CS300.outline = CS300.outline.concat([
    ["var: when you can and cannot", ["m1"]], ["Read and understand Java snippets", ["m17"]],
    ["Static vs non-static fields", ["m2"]], ["Static vs non-static methods", ["m2"]],
    ["Recognize and implement the seven design patterns", ["m12"]], ["Identify and fix a null-pointer exception", ["m4"]],
    ["Write a try/catch block", ["m5"]], ["Activity lifecycle methods and their pattern", ["m13"]],
    ["Backgrounded, comes back, closes", ["m13"]], ["Which methods can access static fields?", ["m2"]],
    ["Which fields can static methods access?", ["m2"]], ["Recognize polymorphism", ["m6"]],
    ["Purposes of the Android classes", ["m14"]], ["Method chaining, and converting a setter", ["m10"]],
    ["Compare all nested class types", ["m7"]], ["Regular Java vs Android", ["m14"]],
    ["Rewrite an anonymous class as a lambda", ["m8"]], ["Recognize Stream API syntax", ["m9"]],
    ["Predicate and Consumer uses", ["m9"]], ["Lambdas vs method references", ["m8"]],
    ["Handler repeated events", ["m15"]], ["Point-rectangle and rectangle-rectangle math", ["m16"]],
    ["Java keywords", ["m3"]], ["Concurrent modification errors", ["m11"]]
  ].map(function (o, i) { return { id: "m2o" + (i + 1), items: String(i + 1), title: o[0], topics: o[1] }; }));

  /* [term, plain definition, short example or memory hook, exam: m1 | m2 | both] */
  CS300.terms = [
    ["Class", "A blueprint that describes what objects can hold and do.", "`class Dog { }`", "both"],
    ["Object / instance", "A real thing made from a class with `new`.", "`Dog d = new Dog();`", "both"],
    ["Field", "A variable that belongs to an object or class.", "`private int age;`", "both"],
    ["Local variable", "A variable inside a method. It disappears when the method ends.", "`int x = 5;` inside a method", "both"],
    ["Constructor", "Runs when an object is created. Same name as the class, with no return type.", "`Dog() { age = 0; }`", "both"],
    ["Hook", "A method a framework calls that you may override to add your own behavior.", "`onCreate`, `onDraw`", "both"],
    ["Abstract method", "A method with no body. A concrete subclass must write it.", "`abstract void run();`", "both"],
    ["Abstract class", "A class you cannot use `new` on. It may hold abstract methods and finished ones.", "`abstract class Shape { }`", "both"],
    ["Superclass, base class, parent class", "The class being extended.", "In `Cat extends Animal`, Animal", "both"],
    ["Subclass, derived class, child class", "The class doing the extending.", "In `Cat extends Animal`, Cat", "both"],
    ["Static method", "Belongs to the class and has no `this`. Call it with the class name.", "`Math.random()`", "both"],
    ["Static field", "One shared copy for the whole class.", "`static int count;`", "both"],
    ["Inheritance", "\"Is a\". A class gets a parent's members using `extends`.", "A Cat is an Animal", "both"],
    ["Composition", "\"Has a\". A class holds another object in a field and uses it.", "A Car has an Engine", "both"],
    ["Design pattern", "A named, reusable solution to a common design problem. An idea, not finished code.", "Observer, Factory", "both"],
    ["Polymorphism", "\"Many forms\". A parent-type variable holds a child object, and the object's version runs.", "`Animal a = new Cat();`", "both"],
    ["Interface", "A contract listing methods a class promises to have.", "`class A implements Runnable`", "both"],
    ["public", "Any class can use it.", "`public void go()`", "both"],
    ["private", "Only code in this class can use it, including nested classes.", "`private int age;`", "both"],
    ["protected", "Same package, plus subclasses.", "`protected void go()`", "both"],
    ["Inner class", "A non-static class inside a class. Tied to an outer object and can use its private members.", "`class Outer { class In { } }`", "both"],
    ["Static nested class", "A `static` class inside a class. Not tied to any outer object.", "`AlertDialog.Builder`", "both"],
    ["Functional interface", "An interface with exactly one abstract method. Can be written as a lambda.", "`Runnable`, `Predicate`", "m2"],
    ["Concurrent modification error", "Changing a list while a for-each loop walks through it. Doesn't need two threads.", "`list.remove(x)` inside for-each", "m2"],
    ["Local inner class", "A named class written inside a method.", "`class A implements Runnable { ... }` in a method", "m2"],
    ["Anonymous class", "A class with no name, made and used at one spot after `new`.", "`new Runnable() { ... }`", "m2"],
    ["Lambda expression", "A short way to write the one method of a functional interface.", "`x -> x * 2`", "m2"],
    ["Method reference", "A shorter lambda that just names an existing method.", "`System.out::println`", "m2"],
    ["Stream", "An assembly line over a collection: start, steps, one end step. The original is unchanged.", "`list.stream().filter(...).count()`", "m2"],
    ["Predicate", "A functional interface that answers yes or no: `boolean test(T)`.", "`x -> x > 0` in `filter`", "m2"],
    ["Consumer", "A functional interface that does something with an item: `void accept(T)`.", "`x -> print(x)` in `forEach`", "m2"],
    ["Method chaining", "Several calls in one statement, each on the last result. Setters use `return this`.", "`p.setA(1).setB(2)`", "m2"],
    ["var", "Lets the compiler work out a local variable's type from its value. The type is still fixed.", "`var n = 5;`", "m2"],
    ["final", "Variable: no reassigning. Method: no overriding. Class: no extending.", "`final int MAX = 5;`", "m2"],
    ["try / catch / finally", "Try risky code, catch a failure, and always run finally.", "`catch (NumberFormatException e)`", "m2"],
    ["Null-pointer exception", "Using a dot on a variable that points to no object.", "`String s = null; s.length();`", "both"],
    ["Activity lifecycle", "The methods Android calls as a screen opens, pauses, resumes and closes. Uses Template Method.", "`onCreate`, `onPause`, `onDestroy`", "m2"],
    ["invalidate()", "Tells a View its picture is out of date, so Android calls `onDraw` soon.", "Never call `onDraw` yourself", "m2"],
    ["Strategy", "Swap a behavior by swapping the object that performs it.", "Duck has a FlyBehavior", "both"],
    ["Factory", "A method that creates and returns an object for you.", "`BitmapFactory.decodeResource`", "both"],
    ["Observer", "One subject notifies many subscribers.", "Weather station and displays", "both"],
    ["Chain of Responsibility", "A request passes along handlers until one handles it.", "Touch events", "both"],
    ["Command", "Packs a request into an object to run later.", "`execute()`, a Runnable", "m2"],
    ["Builder", "Sets up a complex object step by step, then builds it.", "`AlertDialog.Builder`", "m2"],
    ["Template Method", "A parent fixes the order of steps; children fill in the steps.", "Activity lifecycle", "m2"],
    ["Package", "A named group of related classes. Lowercase, reversed domain.", "`edu.byuh.cis.cs300`", "both"],
    ["Syntactic sugar", "Nicer syntax for something you could write the long way.", "The for-each loop", "m1"],
    ["Overloading", "Same name, different parameters. Chosen at compile time.", "`add(int)`, `add(double)`", "m1"],
    ["Overriding", "A subclass replaces a parent's method with the same signature. Chosen at run time.", "`@Override void onDraw(...)`", "m1"],
    ["== vs equals", "`==` on objects asks \"same object?\". `equals` asks \"same contents?\".", "Use `a.equals(b)` for Strings", "m1"],
    ["Tell, Don't Ask (Holub)", "Ask the object with the data to do the work, instead of pulling its data out.", "`c.getArea()`, not `c.getRadius()` math", "m1"],
    ["CRC cards", "Class, Responsibility, Collaborator: a design tool Holub mentions.", "One index card per class", "m1"],
    ["Activity", "One screen of an Android app.", "`class Home extends Activity`", "both"],
    ["View", "Something on screen that draws and receives touches.", "`class Board extends View`", "both"],
    ["Context", "The app's connection to resources and services. An Activity is a Context.", "`new Board(this)`", "both"],
    ["Handler", "Schedules messages or work for later. Used for repeating events.", "`sendMessageDelayed`", "both"],
    ["Bitmap", "An image in memory.", "`BitmapFactory` makes one", "both"],
    ["Toast", "A small popup message that disappears by itself.", "`Toast.makeText(...).show()`", "both"],
    ["Canvas", "The drawing surface and its commands.", "`c.drawLine(...)`", "both"],
    ["Paint", "The drawing style: color, width, fill.", "`p.setColor(...)`", "both"],
    ["RectF", "A rectangle with float left, top, right, bottom.", "`r.contains(x, y)`", "both"]
  ].map(function (t) { return { term: t[0], def: t[1], ex: t[2], exam: t[3] }; });
})();
