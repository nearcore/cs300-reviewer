/* Study notes for CS300 Midterm 1.
   Source: source/CS300 Reviewer.md (updated October 5, 2026). */
window.CS300 = window.CS300 || {};

(function () {
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function code(src) {
    return '<pre class="code"><code class="language-java">' + esc(src.replace(/^\n+|\s+$/g, "")) + "</code></pre>";
  }
  function quiz(html) {
    return '<div class="callout quiz"><span class="label">From class quiz</span><div>' + html + "</div></div>";
  }
  function warn(html) {
    return '<div class="callout warn"><span class="label">Don’t confuse</span><div>' + html + "</div></div>";
  }
  function note(label, html) {
    return '<div class="callout note"><span class="label">' + label + "</span><div>" + html + "</div></div>";
  }
  function table(head, rows, cls) {
    return '<div class="table-wrap"><table' + (cls ? ' class="' + cls + '"' : "") + "><thead><tr>" +
      head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>";
  }

  CS300.topics = {
    t1: "Java packages",
    t2: "Design patterns",
    t3: "Inheritance, composition & Strategy",
    t4: "Factory & object creation",
    t5: "Observer",
    t6: "Chain of Responsibility",
    t7: "Desktop Java & Android",
    t8: "Custom Views & graphics",
    t9: "Handler & touch",
    t10: "Nested classes & lambdas",
    t11: "Holub, responsibilities & CRC",
    t12: "Java fundamentals (CS202)",
    t13: "Vocabulary"
  };

  CS300.sections = [
    {
      id: "t1", num: "1", title: "Java packages",
      html:
        "<p>A <strong>package</strong> is a named namespace that groups related Java types. It organizes code, reduces collisions between classes with the same short name, and influences package-private access. The <code>package</code> statement belongs near the beginning of each Java source file, before imports.</p>" +
        code("package edu.byuh.mc.cis.cs300.asdfirsttry;\n\npublic class Keena { }") +
        "<p>The class above has the full name <code>edu.byuh.mc.cis.cs300.asdfirsttry.Keena</code>. A directory layout commonly mirrors the package segments. Package names are conventionally lowercase, often starting with the organization’s Internet domain in reverse order, such as <code>com.jarnaby.finance</code>. A project name can be capitalized in an IDE; that does not change Java’s package naming convention. Class names normally use UpperCamelCase.</p>" +
        "<p>A package is not the same as an import. The package declaration says where a type belongs; an import lets you use another type’s short name in that file.</p>" +
        quiz("The Java package example was <code>com.jarnaby.finance</code>.")
    },
    {
      id: "t2", num: "2", title: "What design patterns are",
      html:
        "<p>A <strong>design pattern</strong> is a named, reusable approach to a recurring design problem. It describes roles and relationships among classes and objects, not a universal code file. Its value is a shared language and a way to manage change. Before choosing a pattern, ask what varies and which responsibility should own it.</p>" +
        "<h3>Principles from the textbook and class</h3>" +
        "<ul>" +
        "<li><strong>Encapsulate what varies:</strong> separate the parts likely to change from the stable parts.</li>" +
        "<li><strong>Program to an interface:</strong> depend on a common behavior contract rather than a concrete implementation where flexibility matters.</li>" +
        "<li><strong>Favor composition over inheritance</strong> when behavior should be assembled or swapped.</li>" +
        "<li><strong>Keep object responsibilities clear.</strong> A pattern adds structure, so use it for a real need.</li>" +
        "</ul>" +
        "<h3>Patterns named in class</h3>" +
        table(["Pattern", "Core idea", "Midterm priority"], [
          ["Factory / Simple Factory", "Centralize object creation and setup", "Explicit in outline"],
          ["Observer", "One subject notifies interested observers", "Explicit in outline"],
          ["Strategy", "Interchangeable behaviors behind a common interface", "Explicit in outline"],
          ["Chain of Responsibility", "Request moves among potential handlers", "Explicit in outline"],
          ["Composite", "Treat one object and a group uniformly", "Named in class list"],
          ["Singleton", "Control access to one shared instance", "Named in class list"],
          ["Facade", "Simpler interface to a subsystem", "Named in class list"],
          ["Template Method", "Base class defines algorithm outline; subclasses fill steps", "Named in class list"],
          ["Builder", "Construct a complex object step by step", "Named in class list"]
        ]) +
        note("Heads up", "An earlier multiple-choice question asked which patterns had been learned so far and listed all nine above. The record doesn’t preserve an authoritative marked answer for that one. The midterm outline explicitly names the first four as ideas to describe; review the other five at recognition level unless your class notes say more.")
    },
    {
      id: "t3", num: "3", title: "Inheritance, composition, and Strategy",
      html:
        "<p><strong>Inheritance</strong> is an <em>is-a</em> relationship: a Duck is an Animal, or a custom GameView is a View. A subclass extends a superclass and can specialize or override inherited behavior. Use it when the child can genuinely stand in for the parent.</p>" +
        "<p><strong>Composition</strong> is a <em>has-a</em> relationship: a Duck has a FlyBehavior, or a custom View has a Paint and a Bitmap. It delegates work to collaborators, which don’t need to be subclasses of the containing object.</p>" +
        "<p>The lecture progression was <strong>inheritance → composition → Strategy → Simple Factory</strong>. With the Duck examples, putting every flying variation in Duck subclasses creates a growing class hierarchy. Strategy moves the changing flight behavior into an interface plus concrete behavior objects. A Duck holds a FlyBehavior, delegates <code>fly()</code> to it, and can change the behavior at runtime. QuackBehavior works the same way.</p>" +
        code(
"interface FlyBehavior { void fly(); }\n" +
"class FlyWithWings implements FlyBehavior {\n" +
"    public void fly() { /* wing movement */ }\n" +
"}\n" +
"class NoFlying implements FlyBehavior {\n" +
"    public void fly() { /* intentionally no flight */ }\n" +
"}\n" +
"class Duck {\n" +
"    private FlyBehavior flight;\n" +
"    Duck(FlyBehavior flight) { this.flight = flight; }\n" +
"    void performFly() { flight.fly(); }\n" +
"    void setFlight(FlyBehavior next) { flight = next; }\n" +
"}") +
        note("Short version from class", "Composition says “has a.” Strategy says “has a behavior that can be swapped.” Strategy varies <strong>behavior</strong>; Factory varies <strong>creation</strong>.") +
        "<p>Duck/Sprite and Android MediaPlayer were mentioned as class examples. The exact MediaPlayer code wasn’t kept in the record.</p>"
    },
    {
      id: "t4", num: "4", title: "Factory and object creation",
      html:
        "<p>A <strong>Simple Factory</strong> is a method or helper that receives a request, chooses a concrete class, calls its constructor, does any needed setup, and returns a usable object. This keeps repeated construction logic in one place. It does <em>not</em> eliminate constructors, make the JVM inherently faster, or give inheritance without subclasses. In <em>Head First Design Patterns</em>, Simple Factory is an idiom rather than a formal GoF design pattern (around printed page 117).</p>" +
        code(
"Sprite createSprite(String kind) {\n" +
"    Sprite result;\n" +
"    if (\"duck\".equals(kind)) result = new DuckSprite();\n" +
"    else result = new BallSprite();\n" +
"    result.initialize();\n" +
"    return result;\n" +
"}") +
        quiz("<strong>Simple Factory:</strong> the advantage is that all instantiation logic is in one place, which reduces pasted creation code and maintenance.") +
        "<p>A <strong>static factory</strong> is a static method that returns an object. The term describes how the method is declared, not the whole GoF Factory Method Pattern. The textbook quiz answer was “a simple factory implemented as a static method.” A static factory can call a constructor internally; callers just use the returned object.</p>" +
        "<p>The <strong>Factory Method Pattern</strong> delegates a product-creation step to subclasses. <strong>Abstract Factory</strong> creates families of related products. Both differ from a simple <code>create…()</code> method. The instructor emphasized Simple Factory and said it’s enough in many ordinary cases, so don’t assume every <code>create…()</code> method is the formal Factory Method Pattern.</p>" +
        "<h3>Android example from class: BitmapFactory</h3>" +
        code("Bitmap duckImage = BitmapFactory.decodeResource(\n    getResources(), R.drawable.duck);") +
        "<p><code>BitmapFactory</code> is a class of static decoding methods that create <code>Bitmap</code> objects from resources, files, or streams. Class discussion called this a factory-style or “static constructor” API: you call a static creation method instead of a public Bitmap constructor. The Bitmap itself holds image pixels.</p>" +
        quiz("<code>Canvas.drawBitmap()</code> is <strong>not</strong> a factory method. It draws an existing Bitmap and doesn’t create one. <code>BitmapFactory.decodeResource()</code> is what creates/decodes the object.")
    },
    {
      id: "t5", num: "5", title: "Observer",
      html:
        "<p><strong>Observer</strong> sets up a one-to-many dependency: a subject (publisher) keeps a set of observers (subscribers) and notifies them when its state changes. The subject doesn’t need to know each observer’s concrete class, and observers can subscribe and unsubscribe. The book explains it with a weather monitoring station and newspaper subscriptions (definition around printed page 51).</p>" +
        "<h3>Typical roles</h3>" +
        "<ol>" +
        "<li>The Subject offers register, remove, and notify operations.</li>" +
        "<li>The Observer has an update operation.</li>" +
        "<li>Observers register with the Subject.</li>" +
        "<li>When the Subject changes, it notifies observers, which update themselves.</li>" +
        "</ol>" +
        "<p>A weather station publishes measurements to several displays. A UI listener responding to a button event is another intuitive analogy, though Android’s listener code has platform details beyond the book’s generic pattern.</p>" +
        quiz("Observer is the pattern that notifies dependents when one subject changes. The example was a weather monitoring station, and the relationship is one-to-many.") +
        warn("One earlier question listed “Handler” among the choices (its full wording wasn’t kept). An Android Handler schedules work. It is not the Observer pattern.")
    },
    {
      id: "t6", num: "6", title: "Chain of Responsibility",
      html:
        "<p>A request goes to the first handler in a chain. Each handler either handles it or forwards it to its successor, so the sender doesn’t need to know which handler eventually acts. The book’s appendix uses incoming email: spam, fan mail, complaints, and new-location requests go to different handlers (printed pages 602–603). A chain can end with a catch-all handler; otherwise an unhandled request can fall off the end.</p>" +
        code(
"abstract class Handler {\n" +
"    Handler next;\n" +
"    void setNext(Handler next) { this.next = next; }\n" +
"    abstract boolean handle(Request request);\n" +
"}") +
        "<p>The sketch shows the relationship. A real implementation must call <code>next</code> when it can’t handle a request and check that <code>next</code> exists. Chain order matters. The pattern decouples the sender from the receivers but can be harder to trace while debugging.</p>" +
        quiz("Chain of Responsibility was the most recently studied pattern at the time of that quiz.") +
        "<p>Android’s touch-event system came up as a possible handler-chain analogy, but its real dispatch rules are more detailed than this simplified pattern.</p>"
    },
    {
      id: "t7", num: "7", title: "Desktop Java and Android structure",
      html:
        "<p>Both environments use the Java language, objects, interfaces, inheritance, polymorphism, collections, exceptions, and design patterns. The UI frameworks and lifecycles differ.</p>" +
        table(["Desktop Swing", "Android", "Careful explanation"], [
          ["JFrame", "Activity", "Rough screen/window analogy; Activity has a system lifecycle and can host a UI"],
          ["JPanel", "View", "A custom drawable UI component"],
          ["Graphics", "Canvas", "Drawing operations and coordinate space"],
          ["paintComponent(Graphics)", "onDraw(Canvas)", "Callback invoked when drawing is needed"]
        ]) +
        "<p>An <strong>Activity</strong> usually represents one focused screen or task. Android creates it and calls lifecycle methods such as <code>onCreate()</code>. A <strong>View</strong> is a UI building block that measures, draws, and handles input. <strong>Context</strong> gives access to app resources, services, and environment information; an Activity is a Context. <strong>AppCompatActivity</strong> is the AndroidX Activity subclass used in the class project.</p>" +
        "<h3>The class project</h3>" +
        "<p>The package was <code>edu.byuh.mc.cis.cs300.asdfirsttry</code>, with <code>MainActivity.java</code> and a custom <code>Keena.java</code> extending View. MainActivity created a Keena instance and called <code>setContentView(k)</code>. <code>Keena(Context)</code> called <code>super(context)</code>, and its <code>onDraw</code> used <code>Canvas.drawColor(Color.BLACK)</code>. In that version, <code>activity_main.xml</code> wasn’t used as the screen layout, because the View was set directly in code.</p>" +
        "<p><code>AndroidManifest.xml</code> is written in XML. The launch Activity was configured as <code>.MainActivity</code> with a MAIN/LAUNCHER intent filter and <code>android:exported=\"true\"</code>. The package/namespace and the Activity reference must resolve correctly.</p>" +
        quiz("Android single-screen component = <strong>Activity</strong>. AndroidManifest language = <strong>XML</strong>.") +
        "<h3>General vs Android-specific knowledge</h3>" +
        table(["Kind", "Examples"], [
          ["General", "Packages and Java naming, classes, interfaces, inheritance, composition, nested classes, equality, loops, exceptions, polymorphism, patterns, responsibility design"],
          ["Android-specific", "Activity/Context/View lifecycles, resources and R.drawable identifiers, AndroidManifest, Toast, Handler/Looper, Canvas/Paint/Bitmap/BitmapFactory/RectF, density units, touch callbacks"]
        ])
    },
    {
      id: "t8", num: "8", title: "Custom Views, graphics, bitmaps, scaling",
      html:
        "<p>A custom View extends <code>View</code>. Its constructor receives a Context and calls <code>super(context)</code>. Override <code>onDraw(Canvas)</code> to draw; Android supplies the Canvas. After changing model state, call <code>invalidate()</code> to request a redraw. Never call <code>onDraw()</code> yourself.</p>" +
        code(
"class Keena extends View {\n" +
"    private final Paint paint = new Paint();\n" +
"\n" +
"    Keena(Context context) {\n" +
"        super(context);\n" +
"        paint.setColor(Color.BLUE);\n" +
"    }\n" +
"\n" +
"    @Override\n" +
"    protected void onDraw(Canvas canvas) {\n" +
"        super.onDraw(canvas);\n" +
"        canvas.drawColor(Color.BLACK);\n" +
"        canvas.drawCircle(getWidth() / 2f, getHeight() / 2f,\n" +
"                          Math.min(getWidth(), getHeight()) * .1f, paint);\n" +
"    }\n" +
"}") +
        table(["Class", "What it does"], [
          ["Canvas", "Drawing operations such as drawColor, drawCircle, drawBitmap, drawText"],
          ["Paint", "Appearance: color, fill/stroke style, line width, text settings, antialiasing"],
          ["Bitmap", "The actual raster pixels"],
          ["BitmapFactory", "Decodes a Bitmap from a source"],
          ["RectF", "Float rectangle storing left, top, right, bottom; often the destination bounds for a scaled Bitmap"],
          ["Toast", "Short, transient message: <code>Toast.makeText(context, \"Saved\", Toast.LENGTH_SHORT).show()</code>"]
        ]) +
        "<h3>Scaling</h3>" +
        "<p>For responsive geometry, calculate from the View/Canvas dimensions instead of assuming one device resolution. To fit a bitmap of size <em>imageW × imageH</em> into an area <em>viewW × viewH</em> while keeping its aspect ratio, use <code>scale = min(viewW / imageW, viewH / imageH)</code>, then center the resulting width and height. A RectF can hold the destination edges.</p>" +
        note("Worked example", "A 200×100 image in a 400×400 View: scale = min(2, 4) = 2, so it draws at 400×200. Centered vertically, top = (400 − 200) / 2 = 100, giving <code>new RectF(0, 100, 400, 300)</code>.") +
        "<p><strong>Resolution</strong> is the physical pixel count. <strong>Density</strong> describes how pixels relate to Android’s density-independent units. UI dimensions commonly use <code>dp</code> and text sizes use <code>sp</code>. Raster resources can live in density-qualified folders (<code>drawable-mdpi</code>, <code>drawable-hdpi</code>, <code>drawable-xhdpi</code>); images usually go in <code>app/src/main/res/drawable</code> or one of its qualified variants. Resource filenames use lowercase letters, digits, and underscores.</p>"
    },
    {
      id: "t9", num: "9", title: "Handler, repeating events, and touch",
      html:
        "<p>A <strong>Handler</strong> posts Runnable work to a Looper-backed message queue. A Handler created for <code>Looper.getMainLooper()</code> runs posted callbacks on the UI thread. For a repeating event, a Runnable performs an update, requests a redraw, and posts itself again with a delay. Keep the same Runnable object so <code>removeCallbacks</code> can cancel pending runs.</p>" +
        code(
"private final Handler handler = new Handler(Looper.getMainLooper());\n" +
"private final Runnable tick = new Runnable() {\n" +
"    @Override public void run() {\n" +
"        updateGame();\n" +
"        gameView.invalidate();\n" +
"        handler.postDelayed(this, 16);\n" +
"    }\n" +
"};\n" +
"// Start: handler.post(tick);\n" +
"// Stop:  handler.removeCallbacks(tick);") +
        "<p>A 16 ms delay approximates 60 updates per second under ideal conditions; it isn’t an exact frame clock. Avoid long tasks on the UI thread, and stop the callback when the View or Activity should no longer update.</p>" +
        "<h3>Touch</h3>" +
        "<p>Both <strong>View</strong> and <strong>Activity</strong> provide an <code>onTouchEvent(MotionEvent)</code> callback you can override. The same callback receives different actions; check <code>event.getActionMasked()</code> to tell apart <code>ACTION_DOWN</code>, <code>ACTION_MOVE</code>, <code>ACTION_UP</code>, and <code>ACTION_CANCEL</code>. Touch-down and touch-up can be handled in the same method.</p>" +
        quiz("View and Activity were the relevant classes, and <code>onTouchEvent</code> handles both touch-down and touch-up.") +
        warn("Android Handler scheduling is not the Observer pattern.")
    },
    {
      id: "t10", num: "10", title: "Nested, local, and anonymous classes; lambdas",
      html:
        "<p>A <strong>nested class</strong> is declared inside another class. A <strong>non-static inner class</strong> instance has an implicit link to a particular enclosing instance and can directly access its instance members, including private fields. A <strong>static nested class</strong> has no automatic enclosing instance. It can directly access the outer class’s static members; for instance data it needs an explicit object reference.</p>" +
        code(
"class Game {\n" +
"    private int score;\n" +
"    class ScoreLabel {\n" +
"        int current() { return score; }\n" +
"    }\n" +
"    static class Rules {\n" +
"        static final int STARTING_LIVES = 3;\n" +
"    }\n" +
"}\n" +
"// game.new ScoreLabel();   new Game.Rules();") +
        "<ul>" +
        "<li>A <strong>local class</strong> is declared inside a method or block.</li>" +
        "<li>An <strong>anonymous class</strong> is an unnamed class expression created where it’s needed, often to supply a listener or a Runnable.</li>" +
        "<li>A <strong>lambda</strong> is a compact implementation of a functional interface (an interface with one abstract method). It is not a kind of nested class; the whiteboard grouped it with related ways of writing local behavior. Lambdas can capture local variables only if they are final or effectively final.</li>" +
        "</ul>" +
        quiz("A nested class is defined within another class. The two broad member-nested forms emphasized were <strong>inner</strong> and <strong>static nested</strong>. The whiteboard also covered local, anonymous, and lambda forms.")
    },
    {
      id: "t11", num: "11", title: "Holub: responsibilities, encapsulation, CRC",
      html:
        "<p>Allen Holub’s discussion centered on <strong>Tell, Don’t Ask</strong>. If an object owns the information needed for a decision, ask it to do the work instead of pulling its internal state into another class. Objects collaborate by sending messages.</p>" +
        "<p><strong>ATM example:</strong> the ATM should call <code>server.withdraw(amount, pin)</code> and use the returned success or failure. The server validates the PIN, checks the balance, updates the account, and decides whether the withdrawal succeeds. If the ATM instead calls <code>getPIN()</code> and <code>getBalance()</code> and reproduces the rules locally, it knows too much and must change whenever the server’s rules change. (Real PIN handling needs proper security; the classroom point is who owns the logic.)</p>" +
        "<p>The quiz’s Circle snippet fetched <code>c.getRadius()</code> and computed πr² in a separate method. Same concern: if area is Circle’s responsibility, put the area behavior in Circle instead of exposing the radius so a caller can do Circle’s work.</p>" +
        "<p>Holub did <strong>not</strong> say never to use getters or setters. The quiz answer to that absolute statement was <strong>False</strong>. General-purpose APIs may need to expose information to unknown clients; for application-specific classes, intent-based methods usually preserve encapsulation better than routine accessors. Public instance fields are especially brittle because clients depend directly on the representation.</p>" +
        "<h3>CRC cards</h3>" +
        "<p><strong>Class, Responsibility, Collaborator.</strong> A card describes a class, the work it owns, and the classes it collaborates with. Class material separated <em>knowing</em> responsibilities (state, attributes, relationships) from <em>doing</em> responsibilities (operations). In UML visibility notation, public is <code>+</code>, protected is <code>#</code>, and private is <code>−</code>. Attributes are normally private; operations are often public when they form the intended API. A diagram should show meaningful domain behavior, not every trivial getter and setter.</p>" +
        "<h3>Recovered Holub quiz key</h3>" +
        table(["Question", "Correct answer", "Reason"], [
          ["“Holub argues you should never use getter/setter methods.”", "False", "He critiques indiscriminate accessors, not every legitimate use."],
          ["The radius/area snippet violates which opinion?", "“Don’t ask for the information you need to do the work; ask the object that has the information to do the work for you.”", "Area behavior belongs with the object whose data it needs."],
          ["Design tool named near the end?", "CRC Cards", "Class, Responsibility, Collaborator."]
        ])
    },
    {
      id: "t12", num: "12", title: "Java fundamentals from CS202",
      html:
        "<h3>Identity, equality, strings, and null</h3>" +
        "<p>For primitives, <code>==</code> compares values. For object references, <code>==</code> tests whether two references point to the same object. <code>equals()</code> tests logical equality as the class defines it. String overrides equals, so compare text with <code>a.equals(b)</code>, or <code>Objects.equals(a, b)</code> when either side may be null. <code>a.equals(b)</code> throws NullPointerException if <code>a</code> is null. Comparing strings with <code>==</code> can appear to work for interned literals, but it’s the wrong general test.</p>" +
        "<p>If a class overrides <code>equals()</code>, its equals and hashCode contracts must stay consistent for hash collections. A null reference points to no object; dereferencing it throws NullPointerException. Trace where the object should have been initialized, or guard a legitimate absence.</p>" +
        "<h3>Static, overloading, overriding</h3>" +
        "<p>A <strong>static field</strong> belongs to the class and is shared; an instance field belongs to each object. A <strong>static method</strong> is called without a particular object and has no implicit <code>this</code>; it can use instance state only through an explicit object reference.</p>" +
        "<p><strong>Overloading:</strong> same method name, different parameter lists; Java picks the matching signature at compile time. Return type alone does not overload a method. <strong>Overriding:</strong> a subclass provides a compatible implementation of an inherited instance method; dynamic dispatch uses the actual object’s method at runtime. <code>@Override</code> lets the compiler catch accidental mismatches.</p>" +
        "<p>A <strong>constructor</strong> initializes a new object. It isn’t a normal inherited method and has no return type. Constructors can be overloaded.</p>" +
        "<h3>Inheritance, abstract classes, interfaces, polymorphism</h3>" +
        "<p>Superclass = base/parent class; subclass = derived/child class. Class inheritance uses <code>extends</code>. <code>super(…)</code> calls a superclass constructor; <code>super.method()</code> calls an inherited implementation.</p>" +
        "<p>An <strong>abstract class</strong> can’t be instantiated directly. It may contain fields, implemented methods, and abstract methods; a concrete subclass must implement the inherited abstract methods. An <strong>interface</strong> defines a type or contract that implementing classes promise to support, and can also have default and static methods. A class can implement many interfaces but has only one direct superclass.</p>" +
        "<p><strong>Polymorphism</strong> lets one parent or interface reference hold different concrete objects. A FlyBehavior variable can hold FlyWithWings or NoFlying; calling <code>fly()</code> runs the actual object’s implementation.</p>" +
        "<p>A <strong>hook</strong> is a method a framework or base class offers for customization; <code>onDraw(Canvas)</code> is a View framework hook. A <strong>template method</strong> calls steps in a defined order and may invoke hooks. The two terms are related, not identical.</p>" +
        "<h3>Loops, arrays, errors, and syntax</h3>" +
        "<p>An array has a fixed length and indexes from 0 to length − 1. Nested loops put one loop inside another; for a grid, the outer loop can pick rows and the inner loop columns. A for-each loop visits elements without exposing an index. It’s good for reading a collection, not for every job that needs positions or structural changes.</p>" +
        "<p><strong>ConcurrentModificationException</strong> in the duck/flock exercise came from removing ducks from the same ArrayList while a for-each loop iterated over it. It does <strong>not</strong> necessarily mean two threads. The class used Logcat to find the stack trace. The corrected lab collected hit ducks in a separate list, then removed them after the loop, which also handles several ducks hit by one tap. <code>Iterator.remove()</code>, a suitable <code>removeIf()</code>, or other deferred changes are also valid when their semantics fit.</p>" +
        code(
"List<Duck> hit = new ArrayList<>();\n" +
"for (Duck duck : flock) {\n" +
"    if (duck.wasHit(x, y)) hit.add(duck);\n" +
"}\n" +
"flock.removeAll(hit);") +
        "<p>An <strong>exception</strong> is a runtime signal that something went wrong. The stack trace shows the type, the message, and the call locations; look at the first relevant line in your own code. “Crashing is useful” in lecture meant a clear crash usually gives you a trace, not that crashes are good.</p>" +
        "<p><strong>Syntactic sugar</strong> is more convenient syntax for something you could write more explicitly; the enhanced for loop is an example. Be ready to trace ordinary for loops, enhanced for loops, nested loops, method calls, and object references.</p>"
    },
    {
      id: "t13", num: "13", title: "Vocabulary at a glance",
      html:
        table(["Term", "Meaning"], [
          ["Inner class", "Non-static nested class linked to an enclosing object"],
          ["Static nested class", "Member class inside another class, with no implicit outer object"],
          ["Local class", "Class declared inside a method or block"],
          ["Anonymous class", "Unnamed class expression instantiated in place"],
          ["Lambda", "Compact implementation of a functional interface"],
          ["Derived / child / subclass", "Class extending a superclass"],
          ["Base / parent / superclass", "Class being extended"],
          ["Interface", "Contract/type implemented by classes"],
          ["Design pattern", "Reusable named design solution for a recurring problem"],
          ["public", "Broad access wherever the declaring type is accessible"],
          ["private", "Access within the declaring class/nest, under Java rules"],
          ["protected", "Package access plus qualifying subclass access"],
          ["package-private", "No modifier; access from the same package"],
          ["Polymorphism", "Common type, varying concrete object behavior"],
          ["Abstract class", "Incomplete class that can’t be instantiated directly"],
          ["Abstract method", "Declared without a body; a concrete subclass supplies it"],
          ["Static method", "Class-level method with no implicit this"],
          ["Static field", "Class-level variable shared across instances"],
          ["Composition", "Has-a relationship with collaborators"],
          ["Inheritance", "Is-a relationship via subclassing"],
          ["Encapsulation", "Keep representation and behavior behind a deliberate interface"],
          ["Hook", "Customization point offered by a base class or framework"],
          ["CRC", "Class, Responsibility, Collaborator"],
          ["Context", "Android access to resources and environment/services"],
          ["Activity", "Android-managed screen/task component"],
          ["View", "Android UI unit for layout, drawing, and input"],
          ["Handler", "Posts work to a Looper queue"],
          ["Canvas", "Drawing commands and coordinate space"],
          ["Paint", "Appearance of drawing"],
          ["Bitmap", "Raster pixels"],
          ["BitmapFactory", "Decodes/creates Bitmap objects from sources"],
          ["RectF", "Rectangle with floating-point edges"],
          ["Toast", "Brief transient message"]
        ])
    },
    {
      id: "qa", num: "Q&A", title: "Recovered questions and answers",
      html:
        "<p>Questions and clear answer points from earlier CS300 conversations. Wording is paraphrased unless the record kept the original. All of these are in the Quiz tab under “From class.”</p>" +
        table(["Topic / question", "Answer", "Why"], [
          ["Java package example", "com.jarnaby.finance", "Lowercase, reversed-domain style."],
          ["Android component for one UI screen", "Activity", "Screen-level component managed by Android."],
          ["AndroidManifest.xml language", "XML", "It declares components and configuration."],
          ["Swing/Android mapping", "JFrame≈Activity; JPanel≈View; Graphics≈Canvas; paintComponent≈onDraw", "Helpful analogies, not equivalent APIs."],
          ["Holub never uses getters/setters?", "False", "No blanket prohibition."],
          ["Circle radius/area Holub principle", "Tell, Don’t Ask", "Put the work with the data-owning object."],
          ["Holub design tool", "CRC Cards", "Class, Responsibility, Collaborator."],
          ["Simple Factory advantage", "One place for instantiation/setup; less repeated code", "Keeps creation logic central."],
          ["Textbook static factory", "Simple factory implemented as a static method", "“Static” describes the method declaration."],
          ["Android Bitmap factory example", "BitmapFactory.decodeResource(…)", "Decodes and returns a Bitmap."],
          ["Which is not factory creation?", "Canvas.drawBitmap()", "It draws; it doesn’t create."],
          ["Observer purpose", "One-to-many notification on subject change", "Subscribers are updated."],
          ["Observer motivating example", "Weather monitoring station", "Several displays observe measurements."],
          ["Strategy central idea", "Encapsulate interchangeable behavior", "Duck has FlyBehavior/QuackBehavior."],
          ["Chain central idea", "Each handler handles or passes the request", "Sender is separated from the final receiver."],
          ["Most recently studied pattern (earlier quiz)", "Chain of Responsibility", "The answer at that point in class."],
          ["Nested class", "A class declared within another class", "Member nested types include inner and static nested."],
          ["Inner vs static nested", "Inner links to an outer instance; static nested doesn’t", "Direct access to outer instance state differs."],
          ["onTouchEvent override locations", "View and Activity", "Both can receive touch callbacks."],
          ["Touch-down and touch-up", "Same onTouchEvent method, different MotionEvent actions", "Check the event action."],
          ["Duck/flock exception", "ConcurrentModificationException", "Flock changed during for-each iteration."],
          ["Duck/flock repair", "Collect hit ducks, remove after the loop", "Don’t structurally change the list being iterated."]
        ], "plain")
    },
    {
      id: "refs", num: "Ref", title: "References",
      html:
        "<ul>" +
        "<li>Eric Freeman and Elisabeth Robson, <em>Head First Design Patterns, 2nd Edition</em>. Observer definition around printed page 51; Simple Factory around page 117; Chain of Responsibility appendix around pages 602–603.</li>" +
        '<li><a href="https://developer.android.com/develop/ui/views/layout/custom-views/custom-drawing" target="_blank" rel="noopener">Android custom drawing</a></li>' +
        '<li><a href="https://developer.android.com/reference/android/view/View" target="_blank" rel="noopener">Android View API</a></li>' +
        '<li><a href="https://developer.android.com/reference/android/os/Handler" target="_blank" rel="noopener">Android Handler API</a></li>' +
        '<li><a href="https://developer.android.com/reference/android/graphics/BitmapFactory" target="_blank" rel="noopener">Android BitmapFactory API</a></li>' +
        '<li><a href="https://docs.oracle.com/javase/tutorial/java/concepts/" target="_blank" rel="noopener">Oracle: Java OOP concepts</a></li>' +
        '<li><a href="https://docs.oracle.com/javase/tutorial/java/package/" target="_blank" rel="noopener">Oracle: Packages</a></li>' +
        '<li><a href="https://docs.oracle.com/javase/tutorial/java/IandI/" target="_blank" rel="noopener">Oracle: Interfaces and inheritance</a></li>' +
        "</ul>"
    }
  ];

  /* Midterm 1 outline: 17 guide items grouped as in the source file. */
  CS300.outline = [
    { id: "o1", items: "1–2", title: "Packages and naming", topics: ["t1"] },
    { id: "o2", items: "3", title: "Design patterns", topics: ["t2"] },
    { id: "o3", items: "4–5", title: "Desktop/Android APIs; Activity and View", topics: ["t7"] },
    { id: "o4", items: "6", title: "Inner vs static nested classes", topics: ["t10"] },
    { id: "o5", items: "7", title: "Composition and inheritance", topics: ["t3"] },
    { id: "o6", items: "8", title: "Allen Holub", topics: ["t11"] },
    { id: "o7", items: "9–10", title: "Factory, Observer, Strategy, Chain; Android factory example", topics: ["t4", "t5", "t3", "t6"] },
    { id: "o8", items: "11", title: "General vs Android-specific concepts", topics: ["t7"] },
    { id: "o9", items: "12–15", title: "Scaling, Handler, drawable folder, Android classes", topics: ["t8", "t9"] },
    { id: "o10", items: "16", title: "CS202 review", topics: ["t12"] },
    { id: "o11", items: "17", title: "Vocabulary", topics: ["t13"] }
  ];
})();
