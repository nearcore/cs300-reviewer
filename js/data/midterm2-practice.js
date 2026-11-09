/* Midterm 2 flashcards, write-it drills, and code practice for both midterms.
   Every question here is practice material, not from a class quiz.
   kind: "print" and "compile" questions are run by scripts/verify-questions.mjs.
   wrap: "class" puts the code inside a class; default puts it inside main;
   code with its own top-level classes runs as written. */
window.CS300 = window.CS300 || {};

(function () {
  CS300.flashcards = CS300.flashcards.concat([
    [101, "m1", "Where can you use var?", "Local variables with a value on the same line, including loop variables."],
    [102, "m1", "Name four places var fails.", "Fields, parameters, return types, and with no value or a null value."],
    [103, "m1", "Is var dynamically typed?", "No. The compiler picks one type and it stays fixed."],
    [104, "m2", "Static vs instance field?", "Static: one shared copy. Instance: one copy per object."],
    [105, "m2", "Which methods can access static fields?", "Both static and non-static methods."],
    [106, "m2", "Which fields can static methods access directly?", "Only static fields, because a static method has no `this`."],
    [107, "m3", "What does final do on a variable, method, class?", "No reassigning; no overriding; no extending."],
    [108, "m3", "protected means?", "Same package, plus subclasses."],
    [109, "m4", "How do you find a null pointer's cause?", "Check the variable before the dot on the crash line, then find where it should get `new`."],
    [110, "m4", "Why can `Paint p = new Paint();` in a constructor cause a null pointer later?", "It makes a local `p`, so the field stays null."],
    [111, "m5", "When does the rest of a try block run after a throw?", "It doesn't. Java jumps to the matching catch."],
    [112, "m5", "When does finally run?", "Either way: exception or no exception."],
    [113, "m6", "`Animal a = new Cat(); a.speak();` Whose speak runs?", "Cat's. The real object decides."],
    [114, "m6", "What does a variable's declared type decide?", "Which methods you may call. The object decides which version runs."],
    [115, "m7", "List the five nested kinds.", "Inner, static nested, local inner, anonymous, lambda."],
    [116, "m7", "Inner vs static nested?", "Inner is tied to an outer object. Static nested is not."],
    [117, "m7", "`this` in an anonymous class vs a lambda?", "Anonymous: the anonymous object. Lambda: the enclosing object."],
    [118, "m8", "What is a functional interface?", "An interface with exactly one abstract method."],
    [119, "m8", "Which local variables can a lambda use?", "Effectively final ones: never changed after being set."],
    [120, "m8", "Write `s -> System.out.println(s)` as a method reference.", "`System.out::println`"],
    [121, "m8", "When can't you use a method reference?", "When the lambda does more than call one method with the same arguments."],
    [122, "m9", "Predicate's method and use?", "`boolean test(T)`. Yes/no test for `filter` and `removeIf`."],
    [123, "m9", "Consumer's method and use?", "`void accept(T)`. Do something with each item in `forEach`."],
    [124, "m9", "Does `.filter` change the original list?", "No. Streams leave it alone."],
    [125, "m9", "Three stream end steps?", "`forEach`, `collect`, `count` (also `sum`)."],
    [126, "m10", "Two changes to make a setter chainable?", "Return the class type; `return this`."],
    [127, "m10", "Is method chaining a design pattern?", "No. It's a technique."],
    [128, "m11", "What causes a concurrent modification error?", "Changing a list during a for-each over it."],
    [129, "m11", "Does it need two threads?", "No."],
    [130, "m11", "Simplest fix?", "`list.removeIf(x -> test)`."],
    [131, "m12", "The seven patterns on the guide?", "Strategy, Factory, Chain of Responsibility, Command, Builder, Observer, Template Method."],
    [132, "m12", "Strategy vs Factory?", "Strategy varies behavior. Factory varies creation."],
    [133, "m12", "Name Android factories.", "`BitmapFactory.decodeResource`, `Toast.makeText`, `MediaPlayer.create`."],
    [134, "m12", "Why is AlertDialog.Builder a Builder?", "Set options step by step, then `create()`."],
    [135, "m12", "Parts of Observer?", "A listener list, add and remove methods, and a notify loop."],
    [136, "m12", "How does Android use Chain of Responsibility?", "A touch goes to the View. If it returns false, it goes on to the Activity."],
    [137, "m12", "Command in one line?", "A request packed in an object with `execute()`, run by something that doesn't know what it does."],
    [138, "m13", "Lifecycle's design pattern?", "Template Method."],
    [139, "m13", "Backgrounded calls?", "`onPause`, then `onStop`."],
    [140, "m13", "Coming back calls?", "`onRestart`, `onStart`, `onResume`."],
    [141, "m13", "Closing calls?", "`onPause`, `onStop`, `onDestroy`."],
    [142, "m13", "Opening calls?", "`onCreate`, `onStart`, `onResume`."],
    [143, "m14", "Why does Toast need `.show()`?", "`makeText` only creates it."],
    [144, "m14", "Android's replacement for main?", "The launcher Activity from the Manifest; Android calls `onCreate`."],
    [145, "m14", "Canvas vs Paint?", "Canvas draws. Paint is the style."],
    [146, "m15", "How does Handler repeat?", "`handleMessage` calls `sendMessageDelayed` again."],
    [147, "m15", "How do you request a redraw?", "`invalidate()`. Never call `onDraw` yourself."],
    [148, "m16", "Point in rectangle test?", "`x >= left && x < right && y >= top && y < bottom`."],
    [149, "m16", "Rectangle overlap test?", "`a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top`."],
    [150, "m16", "Which way does y grow on a screen?", "Downward. Top is the smaller number."]
  ].map(function (c) { return { id: c[0], topic: c[1], front: c[2], back: c[3] }; }));

  /* Practice you type yourself, then compare. */
  CS300.drills = [
    { id: "d1", topic: "m10", title: "Make a setter chainable", task: "Rewrite this setter so calls can chain.",
      start: "public void setName(String n) {\n    name = n;\n}",
      answer: "public Pet setName(String n) {\n    name = n;\n    return this;\n}",
      why: "Change the return type to the class, and return the current object." },
    { id: "d2", topic: "m8", title: "Anonymous class to lambda", task: "Rewrite with a lambda.",
      start: "handler.post(new Runnable() {\n    @Override\n    public void run() {\n        addBall();\n    }\n});",
      answer: "handler.post(() -> addBall());",
      why: "`run()` has no parameters, so use `()`. Keep only the body." },
    { id: "d3", topic: "m8", title: "Two-parameter listener to lambda", task: "Rewrite with a lambda.",
      start: "builder.setPositiveButton(\"Yes\", new DialogInterface.OnClickListener() {\n    @Override\n    public void onClick(DialogInterface d, int w) {\n        restart();\n    }\n});",
      answer: "builder.setPositiveButton(\"Yes\", (d, w) -> restart());",
      why: "Two parameters need parentheses. Their types can go, because Java knows them from the interface." },
    { id: "d4", topic: "m5", title: "Write a try/catch", task: "Convert `text` to an int. If it isn't a number, set `n` to 0.",
      start: "String text = getInput();\nint n;",
      answer: "String text = getInput();\nint n;\ntry {\n    n = Integer.parseInt(text);\n} catch (NumberFormatException e) {\n    n = 0;\n}",
      why: "`parseInt` throws `NumberFormatException` for bad text. `n` is declared outside so it survives the block." },
    { id: "d5", topic: "m4", title: "Fix the null pointer", task: "Fix this so `draw` doesn't crash.",
      start: "class Ball {\n    private Paint p;\n    Ball() {\n        Paint p = new Paint();\n    }\n    void draw() {\n        p.setColor(1);\n    }\n}",
      answer: "class Ball {\n    private Paint p;\n    Ball() {\n        p = new Paint();\n    }\n    void draw() {\n        p.setColor(1);\n    }\n}",
      why: "Removing `Paint` from the constructor line assigns the field, not a new local variable." },
    { id: "d6", topic: "m11", title: "Fix the concurrent modification", task: "Remove dead balls without the error, in one line.",
      start: "for (Ball b : balls) {\n    if (b.isDead()) {\n        balls.remove(b);\n    }\n}",
      answer: "balls.removeIf(b -> b.isDead());",
      why: "`removeIf` handles the removal safely. It takes a Predicate." },
    { id: "d7", topic: "m9", title: "Loop to stream", task: "Rewrite as one stream statement.",
      start: "int count = 0;\nfor (Ball b : balls) {\n    if (b.isMoving()) {\n        count++;\n    }\n}",
      answer: "long count = balls.stream().filter(b -> b.isMoving()).count();",
      why: "`filter` keeps matches and `count` finishes. `count()` returns a long." },
    { id: "d8", topic: "m15", title: "Write a repeating Handler", task: "Write a Handler subclass that calls `update()` every 50 ms.",
      start: "public class Ticker extends Handler {\n    // your code\n}",
      answer: "public class Ticker extends Handler {\n    public Ticker() {\n        super(Looper.getMainLooper());\n        sendMessageDelayed(obtainMessage(), 50);\n    }\n    @Override\n    public void handleMessage(Message m) {\n        update();\n        sendMessageDelayed(obtainMessage(), 50);\n    }\n}",
      why: "The constructor starts it. `handleMessage` does the work and schedules the next one." },
    { id: "d9", topic: "m16", title: "Write the point test", task: "Return whether (x, y) is inside `r`, without using `contains`.",
      start: "boolean inside(RectF r, float x, float y) {\n    // your code\n}",
      answer: "boolean inside(RectF r, float x, float y) {\n    return x >= r.left && x < r.right\n        && y >= r.top && y < r.bottom;\n}",
      why: "It has to be between both sides and between top and bottom." },
    { id: "d10", topic: "m12", title: "Write Observer", task: "Write a `Clock` subject with add, remove, and a notify loop. Listeners implement `Listener` with `void onTick()`.",
      start: "interface Listener { void onTick(); }\n\nclass Clock {\n    // your code\n}",
      answer: "class Clock {\n    private List<Listener> listeners = new ArrayList<>();\n    void add(Listener l) { listeners.add(l); }\n    void remove(Listener l) { listeners.remove(l); }\n    void tick() {\n        for (Listener l : listeners) {\n            l.onTick();\n        }\n    }\n}",
      why: "The Clock knows only the interface, so any class can subscribe." },
    { id: "d11", topic: "m13", title: "Pause the music", task: "Add the hooks so music pauses in the background, resumes on return, and is released on close.",
      start: "public class Game extends Activity {\n    private MediaPlayer music;\n    // your code\n}",
      answer: "@Override protected void onPause() {\n    super.onPause();\n    music.pause();\n}\n@Override protected void onResume() {\n    super.onResume();\n    music.start();\n}\n@Override protected void onDestroy() {\n    super.onDestroy();\n    music.release();\n}",
      why: "These are Template Method hooks. Android decides when they run." },
    { id: "d12", topic: "t12", title: "Compare strings correctly", task: "Fix the comparison.",
      start: "if (name == \"Mark\") {\n    greet();\n}",
      answer: "if (name.equals(\"Mark\")) {\n    greet();\n}",
      why: "`==` on objects asks whether they're the same object. `equals` compares the text." },
    { id: "d13", topic: "t8", title: "Stop hard-coding pixels", task: "Draw a line across 80% of the screen width, centered.",
      start: "c.drawLine(100, 200, 900, 200, paint);",
      answer: "float w = getWidth();\nfloat h = getHeight();\nc.drawLine(w * 0.1f, h / 2, w * 0.9f, h / 2, paint);",
      why: "Fractions of the screen size scale on every device." }
  ];

  function P(id, topic, code, right, wrong, why, extra) {
    var q = { id: id, src: "practice", kind: "print", topic: topic, q: "What does this print?", code: code, options: ["`" + right + "`"].concat(wrong.map(function (w) { return "`" + w + "`"; })), why: why };
    if (extra) Object.keys(extra).forEach(function (k) { q[k] = extra[k]; });
    return q;
  }
  function T(id, topic, code, exc, wrong, why) { // throws
    return { id: id, src: "practice", kind: "print", topic: topic, q: "What happens when this runs?", code: code, throws: exc, options: ["It throws `" + exc + "`"].concat(wrong), why: why };
  }
  function C(id, topic, code, ok, reason, wrong, why, wrap) {
    var opts = ok ? ["It compiles"].concat(wrong || ["Compile error"]) : ["Compile error: " + reason].concat(wrong || ["It compiles"]);
    return { id: id, src: "practice", kind: "compile", topic: topic, q: "Does this compile?", code: code, expect: ok ? "ok" : "fail", wrap: wrap, options: opts, why: why };
  }
  function K(id, kind, topic, q, right, wrong, why, code) {
    var o = { id: id, src: "practice", kind: kind, topic: topic, q: q, options: [right].concat(wrong), why: why };
    if (code) o.code = code;
    return o;
  }

  var dogs = "class Dog {\n    static int count = 0;\n    int id;\n    Dog() {\n        count++;\n        id = count;\n    }\n}\nclass Main {\n    public static void main(String[] args) {\n        Dog a = new Dog();\n        Dog b = new Dog();\n        System.out.println(a.id + \" \" + b.id + \" \" + Dog.count);\n    }\n}";

  CS300.questions = CS300.questions.concat([
    /* ---- var ---- */
    C("v1", "m1", "var score = 10;", true, "", null, "A local variable with a value: exactly what `var` is for."),
    C("v2", "m1", "class Game {\n    var score = 10;\n}", false, "var can't be a field", null, "`var` is for local variables only. Fields need a written type."),
    C("v3", "m1", "void add(var n) { }", false, "var can't be a parameter", null, "Method parameters need a written type.", "class"),
    C("v4", "m1", "var name;\nname = \"Rex\";", false, "var needs a value on the same line", null, "With no value on that line, the compiler has nothing to work out the type from."),
    C("v5", "m1", "var thing = null;", false, "null has no usable type", null, "The compiler can't pick a type from `null`."),
    C("v6", "m1", "var nums = {1, 2, 3};", false, "bare braces need a declared array type", null, "Write `var nums = new int[]{1, 2, 3};` instead."),
    C("v7", "m1", "var nums = new int[]{1, 2, 3};", true, "", null, "Now the type is clear: `int[]`."),
    C("v8", "m1", "var x = 5;\nx = \"five\";", false, "x is an int and stays an int", null, "`var` still gives one fixed type. Here, int."),
    C("v9", "m1", "for (var i = 0; i < 3; i++) { }", true, "", null, "A loop counter is a local variable."),
    C("v10", "m1", "var f = () -> 5;", false, "a lambda needs a known target type", null, "A lambda needs a named functional interface so Java knows what it implements."),
    P("v11", "m1", "var x = 7 / 2;\nSystem.out.println(x);", "3", ["3.5", "4", "Compile error"], "7 and 2 are ints, so this is integer division, and `x` is an int."),
    /* ---- static ---- */
    P("s1", "m2", dogs, "1 2 2", ["1 1 2", "1 2 1", "2 2 2"], "`count` is shared and keeps rising. `id` is each dog's own copy of the count at creation."),
    P("s2", "m2", "class Box {\n    static int a = 0;\n    int b = 0;\n    void add() { a++; b++; }\n}\nclass Main {\n    public static void main(String[] args) {\n        Box x = new Box();\n        Box y = new Box();\n        x.add();\n        y.add();\n        System.out.println(x.a + \" \" + x.b);\n    }\n}", "2 1", ["1 1", "2 2", "1 2"], "`a` is shared, so both calls raise it. `x.b` only went up once."),
    C("s3", "m2", "class A {\n    int n;\n    static void set() { n = 1; }\n}", false, "a static method can't use an instance field directly", null, "A static method has no `this`, so it can't know which object's `n` you mean."),
    C("s4", "m2", "class A {\n    static int n;\n    void set() { n = 1; }\n}", true, "", null, "Instance methods can use static fields."),
    C("s5", "m2", "class A {\n    int n;\n    static void set(A a) { a.n = 1; }\n}", true, "", null, "A static method can reach an instance field through an object."),
    C("s6", "m2", "class A {\n    void go() { }\n    static void run() { go(); }\n}", false, "a static method can't call an instance method directly", null, "It needs an object, like `new A().go()`."),
    C("s7", "m2", "class A {\n    static void run() { System.out.println(this); }\n}", false, "there is no this in a static method", null, "`this` means the current object. A static method has none."),
    /* ---- keywords ---- */
    C("k1", "m3", "final int n = 5;\nn = 6;", false, "a final variable can't be reassigned", null, "`final` locks the variable after its first value."),
    P("k2", "m3", "final List<Integer> a = new ArrayList<>();\na.add(1);\nSystem.out.println(a.size());", "1", ["0", "Compile error", "It throws an exception"], "`final` stops reassigning `a`. The list itself can still change."),
    C("k3", "m3", "class A { final void go() { } }\nclass B extends A { void go() { } }", false, "a final method can't be overridden", null, "That's what `final` means on a method."),
    C("k4", "m3", "final class A { }\nclass B extends A { }", false, "a final class can't be extended", null, "That's what `final` means on a class."),
    C("k5", "m3", "abstract class A { }\nclass M { A a = new A(); }", false, "an abstract class can't use new", null, "You can only create objects of concrete subclasses."),
    C("k6", "m3", "class A { abstract void go(); }", false, "an abstract method needs an abstract class", null, "A regular class must have all its methods finished."),
    C("k7", "m3", "abstract class A { abstract void go(); }\nclass B extends A { }", false, "B must write go() or be abstract", null, "A concrete subclass has to fill in every abstract method."),
    C("k8", "m3", "class A { private int n; }\nclass B { int get(A a) { return a.n; } }", false, "n is private to A", null, "Private members are visible only inside their own class."),
    K("k9", "concept", "m3", "A method marked `protected` can be used by:", "Classes in the same package, and subclasses", ["Only its own class", "Any class", "Only subclasses in the same package"], "It's wider than package-private because it adds subclasses."),
    K("k10", "concept", "m3", "A member with no access keyword is:", "Package-private: usable in the same package", ["Public", "Private", "Protected"], "Leaving the word out has its own meaning."),
    /* ---- null pointer ---- */
    T("n1", "m4", "String s = null;\nSystem.out.println(s.length());", "NullPointerException", ["It prints `0`", "It prints `null`", "Compile error"], "The dot is used on a variable pointing to no object."),
    T("n2", "m4", "class Tag {\n    private String t;\n    Tag() {\n        String t = \"hi\";\n    }\n    int size() { return t.length(); }\n}\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(new Tag().size());\n    }\n}", "NullPointerException", ["It prints `2`", "It prints `0`", "Compile error"], "The constructor made a local `t`, so the field stayed null."),
    T("n3", "m4", "String[] names = new String[3];\nSystem.out.println(names[0].length());", "NullPointerException", ["It prints `0`", "It prints `3`", "Compile error"], "`new String[3]` makes three empty slots, all null."),
    P("n4", "m4", "String s = null;\nif (s != null && s.length() > 0) {\n    System.out.println(\"text\");\n} else {\n    System.out.println(\"empty\");\n}", "empty", ["text", "It throws NullPointerException", "Compile error"], "`&&` stops at the first false, so `s.length()` never runs. That's the standard null guard."),
    K("n5", "bug", "m4", "This crashes with a null pointer. What's the fix?", "Change the line to `p = new Paint();`", ["Mark the field `public`", "Add `final` to the field", "Call `draw` from `main`"], "With the type in front, the line makes a local variable. Without it, the line assigns the field.", "class Ball {\n    private Paint p;\n    Ball() { Paint p = new Paint(); }\n    void draw() { p.setColor(1); }\n}"),
    P("n6", "m4", "class P {\n    int x;\n    P(int x) { x = x; }\n}\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(new P(5).x);\n    }\n}", "0", ["5", "Compile error", "null"], "`x = x` assigns the parameter to itself. It needs `this.x = x`. An int field defaults to 0."),
    /* ---- try/catch ---- */
    P("t1", "m5", "try {\n    System.out.print(\"a \");\n    Integer.parseInt(\"x\");\n    System.out.print(\"b \");\n} catch (NumberFormatException e) {\n    System.out.print(\"c \");\n} finally {\n    System.out.print(\"d \");\n}", "a c d", ["a b c d", "a b d", "c d"], "The throw skips `b`, the catch runs, and finally always runs."),
    P("t2", "m5", "try {\n    System.out.print(\"a \");\n    Integer.parseInt(\"7\");\n    System.out.print(\"b \");\n} catch (NumberFormatException e) {\n    System.out.print(\"c \");\n} finally {\n    System.out.print(\"d \");\n}", "a b d", ["a b c d", "a c d", "a b"], "No throw, so catch is skipped. Finally still runs."),
    P("t3", "m5", "try {\n    String s = null;\n    s.length();\n    System.out.print(\"x\");\n} catch (NullPointerException e) {\n    System.out.print(\"caught\");\n}", "caught", ["x", "xcaught", "null"], "The line throws before `x` prints."),
    C("t4", "m5", "try {\n    int n = 5;\n} catch (Exception e) { }\nSystem.out.println(n);", false, "n exists only inside the try", null, "Variables declared in a block end with the block. Declare it before `try`."),
    C("t5", "m5", "try {\n    Integer.parseInt(\"x\");\n} catch (Exception e) {\n} catch (NumberFormatException e) {\n}", false, "the specific catch can never be reached", null, "`Exception` already catches everything below it. Put specific types first."),
    /* ---- polymorphism ---- */
    P("p1", "m6", "class Animal { void speak() { System.out.println(\"...\"); } }\nclass Cat extends Animal { @Override void speak() { System.out.println(\"Meow\"); } }\nclass Main {\n    public static void main(String[] args) {\n        Animal a = new Cat();\n        a.speak();\n    }\n}", "Meow", ["...", "... Meow", "Compile error"], "The real object is a Cat, so its version runs."),
    P("p2", "m6", "class Animal { void speak() { System.out.print(\"A \"); } }\nclass Cat extends Animal {\n    @Override void speak() {\n        super.speak();\n        System.out.print(\"C \");\n    }\n}\nclass Main {\n    public static void main(String[] args) {\n        Animal a = new Cat();\n        a.speak();\n    }\n}", "A C", ["C A", "C", "A"], "Cat's version runs first, and it calls the parent's before printing its own."),
    C("p3", "m6", "class Animal { }\nclass Cat extends Animal { void purr() { } }\nclass M {\n    void go() {\n        Animal a = new Cat();\n        a.purr();\n    }\n}", false, "Animal has no purr()", null, "The variable's type decides what you may call, even though the object is a Cat."),
    P("p4", "m6", "class Shape { String name() { return \"shape\"; } }\nclass Dot extends Shape { @Override String name() { return \"dot\"; } }\nclass Line extends Shape { @Override String name() { return \"line\"; } }\nclass Main {\n    public static void main(String[] args) {\n        Shape[] all = { new Dot(), new Shape(), new Line() };\n        for (Shape s : all) {\n            System.out.print(s.name() + \" \");\n        }\n    }\n}", "dot shape line", ["shape shape shape", "dot dot dot", "line shape dot"], "Each object runs its own version. That's polymorphism in a loop."),
    P("p5", "m6", "class P {\n    P() { System.out.print(\"P \"); }\n}\nclass C extends P {\n    C() { System.out.print(\"C \"); }\n}\nclass Main {\n    public static void main(String[] args) {\n        new C();\n    }\n}", "P C", ["C P", "C", "P"], "The parent's constructor always runs first."),
    K("p6", "concept", "m6", "Which line shows polymorphism?", "`View v = new Board(context);`", ["`int n = 5;`", "`Board b = null;`", "`String s = \"hi\";`"], "A parent-type variable holds a child object."),
    /* ---- nested ---- */
    P("c1", "m7", "class Outer {\n    private int n = 5;\n    class In {\n        void show() { System.out.println(n); }\n    }\n}\nclass Main {\n    public static void main(String[] args) {\n        Outer o = new Outer();\n        Outer.In i = o.new In();\n        i.show();\n    }\n}", "5", ["0", "Compile error", "null"], "An inner class is tied to its outer object, and can read its private fields."),
    C("c2", "m7", "class Outer {\n    private int n = 5;\n    static class N {\n        int get() { return n; }\n    }\n}", false, "static nested has no outer object", null, "It would need an `Outer` passed in."),
    C("c3", "m7", "class Outer {\n    private static int n = 5;\n    static class N {\n        int get() { return n; }\n    }\n}", true, "", null, "Static nested classes can use outer static members, even private ones."),
    C("c4", "m7", "class Outer { class In { } }\nclass M { Outer.In i = new Outer.In(); }", false, "an inner class needs an outer object", null, "Write `new Outer().new In()`."),
    P("c5", "m7", "class Main {\n    void go() {\n        Runnable a = new Runnable() {\n            public void run() { System.out.print(this.getClass().getName().equals(\"Main\") + \" \"); }\n        };\n        Runnable b = () -> System.out.print(this.getClass().getName().equals(\"Main\") + \" \");\n        a.run();\n        b.run();\n    }\n    public static void main(String[] args) {\n        new Main().go();\n    }\n}", "false true", ["true true", "false false", "true false"], "In an anonymous class, `this` is the anonymous object. In a lambda, it's the enclosing object."),
    K("c6", "concept", "m7", "Which kind has no name and can only implement a functional interface?", "Lambda expression", ["Anonymous class", "Local inner class", "Static nested class"], "An anonymous class has no name either, but it can implement interfaces with several methods."),
    K("c7", "concept", "m7", "Which kind is declared inside a method and has a name?", "Local inner class", ["Inner class", "Anonymous class", "Static nested class"], "Local means inside a method."),
    /* ---- lambdas ---- */
    C("l1", "m8", "int c = 0;\nRunnable r = () -> c++;", false, "a lambda can't change a local variable", null, "Locals used in a lambda must be effectively final."),
    C("l2", "m8", "int c = 0;\nc++;\nRunnable r = () -> System.out.println(c);", false, "c changed, so it isn't effectively final", null, "Reading is only allowed if the variable never changes. It changed on line 2."),
    C("l3", "m8", "int c = 0;\nRunnable r = () -> System.out.println(c);", true, "", null, "`c` never changes, so it's effectively final."),
    C("l4", "m8", "class A {\n    int c = 0;\n    Runnable r = () -> c++;\n}", true, "", null, "`c` is a field here, so the rule doesn't apply."),
    C("l5", "m8", "interface Two { void a(); void b(); }\nclass M { Two t = () -> { }; }", false, "Two has two abstract methods", null, "Lambdas need a functional interface: exactly one abstract method."),
    P("l6", "m8", "List.of(\"a\", \"b\", \"c\").forEach(System.out::print);", "abc", ["a b c", "cba", "Compile error"], "`print` runs for each item, with no spaces or newlines."),
    K("l7", "concept", "m8", "`x -> list.add(x)` as a method reference is:", "`list::add`", ["`List::add(x)`", "`list.add()`", "`x::add`"], "Object, then `::`, then the method name, with no parentheses."),
    K("l8", "concept", "m8", "`(a, b) -> a + b` has parentheses because:", "It has two parameters", ["All lambdas need them", "It returns a value", "It uses an operator"], "Only one untyped parameter can skip them."),
    /* ---- streams ---- */
    P("r1", "m9", "long n = List.of(1, 2, 3, 4, 5).stream().filter(x -> x % 2 == 0).count();\nSystem.out.println(n);", "2", ["3", "5", "6"], "Only 2 and 4 pass."),
    P("r2", "m9", "int t = List.of(\"a\", \"bb\", \"ccc\").stream().mapToInt(s -> s.length()).sum();\nSystem.out.println(t);", "6", ["3", "abbccc", "Compile error"], "Lengths 1, 2, 3 add to 6."),
    P("r3", "m9", "List.of(3, 4, 5).stream().filter(x -> x > 3).forEach(x -> System.out.print(x + \" \"));", "4 5", ["3", "3 4 5", "true true"], "`filter` keeps items greater than 3."),
    P("r4", "m9", "List<Integer> a = new ArrayList<>(List.of(1, 2, 3));\na.stream().filter(x -> x > 1).count();\nSystem.out.println(a.size());", "3", ["2", "1", "0"], "Streams don't change the original list."),
    P("r5", "m9", "List<Integer> a = new ArrayList<>(List.of(1, 2, 3, 4));\na.removeIf(x -> x % 2 == 1);\nSystem.out.println(a);", "[2, 4]", ["[1, 3]", "[1, 2, 3, 4]", "2"], "`removeIf` removes items where the test is true: the odd ones. This one does change the list."),
    P("r6", "m9", "Predicate<String> p = s -> s.length() > 2;\nSystem.out.println(p.test(\"hi\") + \" \" + p.test(\"hey\"));", "false true", ["true false", "true true", "2 3"], "Predicate's method is `test`, and it returns a boolean."),
    P("r7", "m9", "Consumer<String> c = s -> System.out.print(s + \"!\");\nc.accept(\"hi\");", "hi!", ["hi", "!", "true"], "Consumer's method is `accept`, and it returns nothing."),
    K("r8", "concept", "m9", "`filter` takes which interface?", "Predicate", ["Consumer", "Runnable", "Comparator"], "It needs a yes or no for each item."),
    K("r9", "concept", "m9", "`forEach` takes which interface?", "Consumer", ["Predicate", "Runnable", "Function"], "It does something with each item, and returns nothing."),
    /* ---- chaining ---- */
    P("h1", "m10", "class Sum {\n    int v = 0;\n    Sum add(int n) {\n        v += n;\n        return this;\n    }\n}\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(new Sum().add(2).add(3).v);\n    }\n}", "5", ["3", "2", "0"], "Each `add` returns the same object, so both additions land on it."),
    C("h2", "m10", "class Pet {\n    int a;\n    void setA(int n) { a = n; }\n    void setB(int n) { }\n    void go() { new Pet().setA(1).setB(2); }\n}", false, "setA returns void", null, "You can't call a method on nothing. Return `Pet` and `this`."),
    P("h3", "m10", "String s = \"  hi \";\nSystem.out.println(s.trim().toUpperCase());", "HI", ["  HI ", "hi", "HI "], "`trim` removes the outer spaces, and `toUpperCase` runs on that result."),
    P("h4", "m10", "String s = \"hi\";\ns.toUpperCase();\nSystem.out.println(s);", "hi", ["HI", "null", "Compile error"], "Strings never change. The new String was thrown away because it wasn't assigned."),
    /* ---- concurrent modification ---- */
    T("o1", "m11", "List<Integer> a = new ArrayList<>(List.of(1, 2, 3));\nfor (Integer x : a) {\n    if (x == 1) a.remove(x);\n}\nSystem.out.println(a);", "java.util.ConcurrentModificationException", ["It prints `[2, 3]`", "It prints `[1, 2, 3]`", "Compile error"], "The list changed during the for-each, with only one thread."),
    P("o2", "m11", "List<Integer> a = new ArrayList<>(List.of(1, 2, 3));\nList<Integer> doomed = new ArrayList<>();\nfor (Integer x : a) {\n    if (x == 1) doomed.add(x);\n}\na.removeAll(doomed);\nSystem.out.println(a);", "[2, 3]", ["[1, 2, 3]", "[1]", "It throws an exception"], "Removal waits until the loop is over."),
    K("o3", "bug", "m11", "Why can this crash even with no `remove` in the loop?", "`spawn` adds to the same list during the for-each", ["`tick` must be static", "for-each can't call methods", "`spawn` needs `final`"], "The change is hidden in a called method. It's still a change during iteration.", "void tick() {\n    for (Ball b : balls) {\n        b.move();\n        if (b.isDone()) spawn();  // spawn() calls balls.add(...)\n    }\n}"),
    /* ---- patterns ---- */
    P("a1", "m12", "interface Fly { void go(); }\nclass Duck {\n    Fly f;\n    void perform() { f.go(); }\n}\nclass Main {\n    public static void main(String[] args) {\n        Duck d = new Duck();\n        d.f = () -> System.out.print(\"wings \");\n        d.perform();\n        d.f = () -> System.out.print(\"rocket \");\n        d.perform();\n    }\n}", "wings rocket", ["wings wings", "rocket rocket", "rocket wings"], "Strategy: changing the object changes the behavior at runtime."),
    P("a2", "m12", "abstract class Game {\n    final void play() { start(); turn(); end(); }\n    abstract void start();\n    abstract void turn();\n    void end() { System.out.print(\"end \"); }\n}\nclass Chess extends Game {\n    void start() { System.out.print(\"setup \"); }\n    void turn() { System.out.print(\"move \"); }\n}\nclass Main {\n    public static void main(String[] args) {\n        new Chess().play();\n    }\n}", "setup move end", ["end setup move", "setup move", "move setup end"], "Template Method: the parent fixes the order. `end` is a hook that Chess didn't override."),
    P("a3", "m12", "interface L { void on(); }\nclass S {\n    List<L> ls = new ArrayList<>();\n    void add(L x) { ls.add(x); }\n    void tell() { for (L x : ls) x.on(); }\n}\nclass Main {\n    public static void main(String[] args) {\n        S s = new S();\n        s.add(() -> System.out.print(\"A \"));\n        s.add(() -> System.out.print(\"B \"));\n        s.tell();\n        s.tell();\n    }\n}", "A B A B", ["A B", "A A B B", "B A B A"], "Observer: each `tell` notifies every subscriber in the list."),
    P("a4", "m12", "abstract class H {\n    H next;\n    void handle(int n) {\n        if (can(n)) System.out.print(name());\n        else if (next != null) next.handle(n);\n        else System.out.print(\"none\");\n    }\n    abstract boolean can(int n);\n    abstract String name();\n}\nclass Small extends H {\n    boolean can(int n) { return n < 10; }\n    String name() { return \"small\"; }\n}\nclass Big extends H {\n    boolean can(int n) { return n >= 100; }\n    String name() { return \"big\"; }\n}\nclass Main {\n    public static void main(String[] args) {\n        H a = new Small();\n        a.next = new Big();\n        a.handle(50);\n    }\n}", "none", ["small", "big", "smallbig"], "Chain of Responsibility: 50 fails both, so it falls off the end of the chain."),
    P("a5", "m12", "class Pizza {\n    String s = \"\";\n    static class Builder {\n        Pizza p = new Pizza();\n        Builder size(String x) { p.s += x + \" \"; return this; }\n        Builder cheese() { p.s += \"cheese \"; return this; }\n        Pizza build() { return p; }\n    }\n}\nclass Main {\n    public static void main(String[] args) {\n        Pizza z = new Pizza.Builder().cheese().size(\"L\").build();\n        System.out.println(z.s);\n    }\n}", "cheese L", ["L cheese", "cheese", "L"], "Builder with chaining: steps apply in the order they're called."),
    P("a6", "m12", "interface Command { void execute(); }\nclass Remote {\n    Command c;\n    void press() { c.execute(); }\n}\nclass Main {\n    public static void main(String[] args) {\n        Remote r = new Remote();\n        r.c = () -> System.out.print(\"on \");\n        System.out.print(\"start \");\n        r.press();\n    }\n}", "start on", ["on start", "on", "start"], "Command: the request waits inside an object until `press` runs it."),
    P("a7", "m12", "class Cat { public String toString() { return \"cat\"; } }\nclass Dog { public String toString() { return \"dog\"; } }\nclass Pets {\n    static Object make(int n) {\n        if (n > 0) return new Cat();\n        return new Dog();\n    }\n}\nclass Main {\n    public static void main(String[] args) {\n        System.out.println(Pets.make(0) + \" \" + Pets.make(1));\n    }\n}", "dog cat", ["cat dog", "cat cat", "dog dog"], "Factory: a static method decides which object to create."),
    K("a8", "pattern", "m12", "`new AlertDialog.Builder(c).setTitle(\"Hi\").create()` uses:", "Builder", ["Factory", "Observer", "Strategy"], "Set options step by step, then build."),
    K("a9", "pattern", "m12", "`Toast.makeText(c, \"Hi\", Toast.LENGTH_LONG)` uses:", "Factory", ["Builder", "Command", "Template Method"], "A static method creates and returns the object."),
    K("a10", "pattern", "m12", "You override `onPause`, and Android decides when it runs. Which pattern?", "Template Method", ["Observer", "Strategy", "Chain of Responsibility"], "The parent controls the steps, and `onPause` is a hook."),
    K("a11", "pattern", "m12", "A View returns false from `onTouchEvent`, so the Activity gets the touch. Which pattern?", "Chain of Responsibility", ["Observer", "Command", "Builder"], "Handle it, or pass it along."),
    K("a12", "pattern", "m12", "A class keeps a list of listeners and calls each one when an event happens. Which pattern?", "Observer", ["Strategy", "Builder", "Factory"], "One subject, many subscribers."),
    K("a13", "pattern", "m12", "A Hero has an `Attack` field that can be replaced during the game. Which pattern?", "Strategy", ["Factory", "Template Method", "Observer"], "A has-a behavior that can be swapped."),
    K("a14", "pattern", "m12", "A button runs an object's `execute()` without knowing what it does. Which pattern?", "Command", ["Strategy", "Builder", "Factory"], "The request is packed in an object. Strategy swaps how one job is done, while Command packages what to do."),
    K("a15", "pattern", "m12", "Which is NOT a design pattern?", "Method chaining", ["Observer", "Builder", "Template Method"], "It's a technique."),
    K("a16", "pattern", "m12", "`Canvas.drawBitmap(...)` is a Factory example.", "False: it draws an image and creates nothing", ["True: it returns a Bitmap", "True: it's a static method", "False: it's an Observer"], "`BitmapFactory.decodeResource` is the factory."),
    /* ---- lifecycle ---- */
    K("f1", "concept", "m13", "An app goes to the Home screen. Which run?", "`onPause`, then `onStop`", ["`onStop`, then `onPause`", "`onDestroy`", "`onPause` only"], "Backgrounding pauses, then stops. It isn't destroyed."),
    K("f2", "concept", "m13", "The user returns to it. Which run?", "`onRestart`, `onStart`, `onResume`", ["`onCreate`, `onStart`, `onResume`", "`onResume` only", "`onStart` only"], "`onCreate` runs only on creation."),
    K("f3", "concept", "m13", "`finish()` is called. Which run?", "`onPause`, `onStop`, `onDestroy`", ["`onDestroy` only", "`onStop`, `onDestroy`", "`onPause`, `onDestroy`"], "Closing goes through all three."),
    K("f4", "concept", "m13", "A new Activity opens. Which run?", "`onCreate`, `onStart`, `onResume`", ["`onStart`, `onCreate`, `onResume`", "`onCreate` only", "`onResume`, `onStart`, `onCreate`"], "Create, start, resume."),
    K("f5", "concept", "m13", "Where should a music player be released?", "`onDestroy`", ["`onCreate`", "`onResume`", "`onDraw`"], "After release it can't play, so do it only when closing."),
    K("f6", "concept", "m13", "The activity lifecycle uses which pattern?", "Template Method", ["Observer", "Factory", "Builder"], "Android fixes the order, and you override hooks."),
    /* ---- android ---- */
    K("g1", "concept", "m14", "Which class holds color, line width, and text size?", "Paint", ["Canvas", "Bitmap", "View"], "Canvas draws, and Paint is the style."),
    K("g2", "concept", "m14", "Which class represents an image in memory?", "Bitmap", ["Canvas", "Paint", "Toast"], "Bitmap holds the pixels."),
    K("g3", "concept", "m14", "Which is the app's connection to resources and services?", "Context", ["Handler", "Paint", "Message"], "An Activity is a Context."),
    K("g4", "concept", "m14", "What's wrong? `Toast.makeText(c, \"Hi\", Toast.LENGTH_SHORT);`", "No `.show()`, so nothing appears", ["It needs `new`", "It must be in `onDraw`", "`Toast` is abstract"], "`makeText` only creates it."),
    K("g5", "concept", "m14", "What do you get calling `getWidth()` in a View's constructor?", "0", ["The screen width", "A null pointer", "A compile error"], "It has no size yet. Use it in `onDraw`."),
    K("g6", "concept", "m14", "How does an Android app differ from a regular Java program?", "Android calls your hooks instead of starting at your `main`", ["Android doesn't use classes", "Android has no inheritance", "Regular Java can't use lambdas"], "The language is the same, but who's in control differs."),
    /* ---- handler ---- */
    K("j1", "concept", "m15", "What makes a Handler repeat?", "`handleMessage` sends the next delayed message", ["A `while(true)` loop", "`invalidate` calls it", "`Thread.sleep` in `onDraw`"], "Each message schedules the next."),
    K("j2", "concept", "m15", "`sendMessageDelayed(obtainMessage(), 100)`: what is 100?", "Milliseconds", ["Seconds", "Repeats", "Frames"], "100 ms is a tenth of a second."),
    K("j3", "bug", "m15", "This ticks only once. Why?", "`handleMessage` doesn't schedule the next message", ["`update` must be static", "`obtainMessage` needs arguments", "It needs `@Override` twice"], "The repeat comes from scheduling again inside `handleMessage`.", "public class T extends Handler {\n    public T() { sendMessageDelayed(obtainMessage(), 100); }\n    @Override public void handleMessage(Message m) {\n        update();\n    }\n}"),
    /* ---- math ---- */
    P("x1", "m16", "float l = 0, t = 0, r = 10, b = 10;\nfloat x = 5, y = 20;\nSystem.out.println(x >= l && x < r && y >= t && y < b);", "false", ["true", "5", "20"], "y = 20 is past the bottom edge at 10."),
    P("x2", "m16", "float l = 0, t = 0, r = 10, b = 10;\nfloat x = 9, y = 1;\nSystem.out.println(x >= l && x < r && y >= t && y < b);", "true", ["false", "9", "1"], "It's within both ranges."),
    P("x3", "m16", "int aL = 0, aT = 0, aR = 10, aB = 10;\nint bL = 5, bT = 5, bR = 15, bB = 15;\nSystem.out.println(aL < bR && aR > bL && aT < bB && aB > bT);", "true", ["false", "5", "10"], "All four checks pass, so they overlap."),
    P("x4", "m16", "int aL = 0, aT = 0, aR = 10, aB = 10;\nint bL = 20, bT = 5, bR = 30, bB = 15;\nSystem.out.println(aL < bR && aR > bL && aT < bB && aB > bT);", "false", ["true", "10", "20"], "`aR > bL` means 10 > 20, which is false. One false is enough."),
    /* ---- reading ---- */
    P("u1", "m17", "int c = 0;\nfor (int i = 0; i < 5; i++) {\n    for (int j = 0; j < 5; j++) {\n        c++;\n    }\n}\nSystem.out.println(c);", "25", ["10", "5", "20"], "The inner loop runs fully for each of the 5 outer passes."),
    P("u2", "m17", "int c = 0;\nfor (int i = 0; i <= 5; i++) {\n    c++;\n}\nSystem.out.println(c);", "6", ["5", "4", "0"], "`<=` runs for 0 through 5. A grid of 5 cells needs 6 lines for this reason."),
    P("u3", "m17", "int[] a = {7, 8, 0};\nint carry = 1;\nfor (int i = 0; i < a.length; i++) {\n    if (a[i] == 0) { a[i] = carry; break; }\n    int old = a[i];\n    a[i] = carry;\n    carry = old;\n}\nSystem.out.println(a[0] + \" \" + a[1] + \" \" + a[2]);", "1 7 8", ["7 8 1", "1 8 0", "8 7 1"], "A swap walks along the array, pushing each value over one spot until it hits the empty slot."),
    P("u4", "m17", "char c = 'A';\nc++;\nSystem.out.println(c);", "B", ["A", "66", "Compile error"], "A char is a number under the hood, and `++` moves to the next letter while keeping it a char."),
    P("u5", "m17", "System.out.println('3' - '1');", "2", ["31", "3-1", "Compile error"], "Subtracting chars gives an int, the distance between them."),
    P("u6", "m17", "float w = 160;\nfloat unit = w / 16;\nSystem.out.println(unit * 2.5f);", "25.0", ["25", "10.0", "400.0"], "Screen math with fractions: 160 / 16 = 10, then 10 × 2.5."),
    P("u7", "m17", "int[] a = {1, 2};\nfor (int x : a) {\n    x = 0;\n}\nSystem.out.println(a[0]);", "1", ["0", "2", "Compile error"], "`x` is a copy of the value, so the array doesn't change."),
    P("u8", "m17", "boolean on = false;\non = !on;\non = !on;\non = !on;\nSystem.out.println(on);", "true", ["false", "3", "Compile error"], "Each `!` flips it: true, false, true."),

    /* ---- Midterm 1 code practice ---- */
    P("e1", "t12", "String a = new String(\"hi\");\nString b = new String(\"hi\");\nSystem.out.println((a == b) + \" \" + a.equals(b));", "false true", ["true true", "false false", "true false"], "Two different objects, with the same text. `==` compares objects; `equals` compares contents."),
    P("e2", "t12", "class P {\n    static void show(Object o) { System.out.print(\"object \"); }\n    static void show(String s) { System.out.print(\"string \"); }\n    public static void main(String[] args) {\n        Object o = \"hi\";\n        show(o);\n        show(\"hi\");\n    }\n}", "object string", ["string string", "object object", "string object"], "Overloads are chosen at compile time from the variable's declared type."),
    P("e3", "t12", "class A { String who() { return \"A\"; } }\nclass B extends A { @Override String who() { return \"B\"; } }\nclass Main {\n    public static void main(String[] args) {\n        A x = new B();\n        System.out.println(x.who());\n    }\n}", "B", ["A", "AB", "Compile error"], "Overriding is chosen at run time from the real object."),
    C("e4", "t12", "class A {\n    void go() { }\n    int go() { return 1; }\n}", false, "only the return type differs", null, "Overloads need different parameters."),
    C("e5", "t12", "class A {\n    void go() { }\n    void go(int n) { }\n}", true, "", null, "Same name, different parameters: that's overloading."),
    C("e6", "t12", "interface I { void a(); }\nclass C implements I { }", false, "C must write a()", null, "A class promises every method in its interface unless it's abstract."),
    P("e7", "t12", "System.out.println(7 / 2 + \" \" + 7 / 2f);", "3 3.5", ["3.5 3.5", "3 3", "3.5 3"], "With two ints the decimal is dropped. One float keeps it. This is why scaling code writes `w / 16f`."),
    P("e8", "t10", "class Outer {\n    int n = 1;\n    class In { int get() { return n + 1; } }\n}\nclass Main {\n    public static void main(String[] args) {\n        Outer o = new Outer();\n        Outer.In i = o.new In();\n        o.n = 10;\n        System.out.println(i.get());\n    }\n}", "11", ["2", "1", "10"], "The inner object reads its outer object's current value."),
    C("e9", "t12", "class A {\n    private A() { }\n}\nclass M { A a = new A(); }", false, "the constructor is private", null, "Private applies to constructors too."),
    K("e10", "concept", "t1", "Which package name follows the convention?", "`edu.byuh.cis.game`", ["`Edu.Byuh.Game`", "`game.byuh.edu`", "`edu/byuh/game`"], "Lowercase, with the domain reversed."),
    K("e11", "bug", "t8", "Why will this look wrong on a tablet?", "It hard-codes pixel values rather than using screen size", ["`drawLine` needs a Bitmap", "`onDraw` must be static", "Paint must be local"], "Base everything on `getWidth()` and `getHeight()`.", "@Override\nprotected void onDraw(Canvas c) {\n    c.drawLine(100, 200, 900, 200, paint);\n}"),
    K("e12", "pattern", "t3", "A Car class has an Engine field. This is:", "Composition", ["Inheritance", "Polymorphism", "Overloading"], "Has a."),
    K("e13", "concept", "t11", "Holub would prefer which?", "`circle.getArea()`", ["`3.14 * circle.getRadius() * circle.getRadius()`", "A public `radius` field", "A static `Math` helper reading the radius"], "Ask the object with the data to do the work."),
    K("e14", "concept", "t8", "Where do images typically go in an Android project?", "`res/drawable`", ["`src/images`", "`res/layout`", "`assets/java`"], "They're referenced as `R.drawable.name`.")
  ]);
})();
