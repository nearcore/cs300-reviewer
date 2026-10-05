# CS300 Reviewer

> Knowledge base for recreating the CS300 Learning project in Claude. Updated October 5, 2026.

## Instructions for the assistant using this file

- Teach the material in plain language first, then use a small Java or Android example and a short check question.
- Use the midterm outline and recovered class discussions as the course scope. Use the attached *Head First Design Patterns, 2nd Edition* for pattern explanations when it is also available to the project. Use current official Java/Android documentation to verify API details when online access is available.
- Distinguish **confirmed class quiz answers** from **reconstructed or paraphrased question wording**. The question bank below marks this distinction. Do not claim access to complete verbatim transcripts of every older chat.
- When a class analogy simplifies the API (for example, JFrame≈Activity), explain the practical similarity and the actual platform difference.
- If a previous explanation conflicts with Java/Android behavior, correct it clearly and retain the useful classroom point.
- This file is a study knowledge base, not an instruction to give only answer keys. Explain the reasoning and invite the learner to predict code behavior.

## Scope and how to study

This reviewer gathers the CS300 Midterm 1 outline, the CS300 conversations available in this project, the attached *Head First Design Patterns, 2nd Edition*, and the class examples and quiz corrections recovered from earlier discussions. The exact wording of some older quiz questions and lectures was not retained in the available conversation summaries; those entries are marked as reconstructed instead of being presented as verbatim transcripts.

Study in this order: read a concept, explain it aloud without looking, trace its example, then answer the related questions and flashcards. For a compare-and-contrast answer, state what the two ideas share, the key difference, and one example.

## Midterm outline coverage

| Guide item | Where to study |
| --- | --- |
| 1–2. Packages and naming | Java packages |
| 3. Design patterns | Pattern foundations |
| 4–5. Desktop/Android APIs; Activity and View | Android structure |
| 6. Inner vs static nested classes | Nested classes |
| 7. Composition and inheritance | Object-oriented relationships |
| 8. Allen Holub | Holub and object responsibilities |
| 9–10. Factory, Observer, Strategy, Chain; Android factory example | Pattern chapters and quiz bank |
| 11. General vs Android-specific concepts | Android structure |
| 12–15. Scaling, Handler, drawable folder, Android classes | Graphics, events, and API reference |
| 16. CS202 review | Java fundamentals |
| 17. Vocabulary | Vocabulary and flashcards |

# Topics

## 1. Java packages

A package is a named namespace that groups related Java types. It organizes code, reduces collisions between classes with the same short name, and influences package-private access. The package statement belongs near the beginning of each Java source file, before imports.

~~~java
package edu.byuh.mc.cis.cs300.asdfirsttry;

public class Keena { }
~~~

The class above has the full name edu.byuh.mc.cis.cs300.asdfirsttry.Keena. A directory layout commonly mirrors the package segments. Package names are conventionally lowercase, often starting with the organization's Internet domain in reverse order, such as com.jarnaby.finance (an earlier quiz example). A project name can be capitalized in an IDE; that does not change Java's package naming convention. Class names normally use UpperCamelCase.

A package is not the same as an import. The package declaration says where a type belongs; an import allows you to use another type's short name in that file.

**Earlier quiz answer:** the Java package example was com.jarnaby.finance.

## 2. What design patterns are

A design pattern is a named, reusable approach to a recurring design problem. It describes roles and relationships among classes/objects, not a universal code file. Its value is a shared language and a way to manage change. Ask what varies and what responsibility should own it before choosing a pattern.

Principles emphasized by the textbook and class:

- Encapsulate what varies: separate parts likely to change from stable parts.
- Program to an interface: depend on a common behavior contract rather than a concrete implementation where flexibility matters.
- Favor composition over inheritance when behavior should be assembled or swapped.
- Keep object responsibilities clear. A pattern adds structure, so use it for a real need.

### Patterns named in our conversations

| Pattern | Core idea | Midterm priority |
| --- | --- | --- |
| Factory / Simple Factory | Centralize object creation and setup | Explicit in outline |
| Observer | One subject notifies interested observers | Explicit in outline |
| Strategy | Interchangeable behaviors behind a common interface | Explicit in outline |
| Chain of Responsibility | Request moves among potential handlers | Explicit in outline |
| Composite | Treat one object and a group uniformly | Named in class pattern list |
| Singleton | Control access to one shared instance | Named in class pattern list |
| Facade | Simpler interface to a subsystem | Named in class pattern list |
| Template Method | Base class defines algorithm outline; subclasses fill steps | Named in class pattern list |
| Builder | Construct a complex object step by step | Named in class pattern list |

The earlier multiple-choice question asked which patterns had been learned thus far and listed all nine above. The available record does not preserve an authoritative marked selection for that particular question. The midterm outline explicitly names the first four as ideas to describe; review the others at recognition level unless your class notes say more.

## 3. Inheritance, composition, and Strategy

Inheritance means an **is-a** relationship: a Duck is an Animal, or a custom GameView is a View. A subclass extends a superclass and can specialize or override inherited behavior. Inheritance is useful when the child can genuinely stand in for the parent.

Composition means a **has-a** relationship: a Duck has a FlyBehavior, or a custom View has a Paint and a Bitmap. It delegates work to collaborators. Composition does not require those collaborators to be subclasses of the containing object.

The lecture progression was inheritance → composition → Strategy → Simple Factory. With Duck examples, putting every flying variation in Duck subclasses creates a growing class hierarchy. Strategy moves the changing flight behavior into an interface and concrete behavior objects. A Duck holds a FlyBehavior, delegates fly() to it, and can change the behavior at runtime. QuackBehavior works the same way.

~~~java
interface FlyBehavior { void fly(); }
class FlyWithWings implements FlyBehavior {
    public void fly() { /* wing movement */ }
}
class NoFlying implements FlyBehavior {
    public void fly() { /* intentionally no flight */ }
}
class Duck {
    private FlyBehavior flight;
    Duck(FlyBehavior flight) { this.flight = flight; }
    void performFly() { flight.fly(); }
    void setFlight(FlyBehavior next) { flight = next; }
}
~~~

The short distinction from class: composition says "has a"; Strategy says "has a behavior that can be swapped." Strategy is about varying **behavior**; Factory is about varying **creation**. Duck/Sprite and Android MediaPlayer were mentioned as class examples, but the precise MediaPlayer code was not retained in the available conversation record.

## 4. Factory and object creation

A Simple Factory is a method or helper that receives a request, chooses a concrete class, calls its constructor, performs needed setup, and returns a usable object. This keeps repeated construction logic in one place. It does not eliminate constructors, make the JVM inherently faster, or give inheritance without subclasses. In *Head First Design Patterns*, Simple Factory is an idiom rather than a formal GoF design pattern (book discussion around printed page 117).

~~~java
Sprite createSprite(String kind) {
    Sprite result;
    if ("duck".equals(kind)) result = new DuckSprite();
    else result = new BallSprite();
    result.initialize();
    return result;
}
~~~

**Simple Factory quiz:** the advantage is that all instantiation logic is in one place, reducing pasted creation code and maintenance.

A **static factory** is a static method that returns an object. That term describes how the method is declared, not the entire GoF Factory Method Pattern. The earlier textbook quiz's answer was "a simple factory implemented as a static method." A static factory can internally call a constructor; callers simply use the returned object.

**Factory Method Pattern** delegates a product-creation step to subclasses. **Abstract Factory** creates families of related products. These are distinct from a simple create...() method. The instructor's discussions emphasized the Simple Factory and said it is enough in many ordinary cases; do not assume every create...() method is the formal Factory Method Pattern.

### Android example from class: BitmapFactory

~~~java
Bitmap duckImage = BitmapFactory.decodeResource(
    getResources(), R.drawable.duck);
~~~

BitmapFactory is a class of static decoding methods that create Bitmap objects from resources, files, or streams. The class discussion called this a factory-style or "static constructor" API: the point is that you call a static creation method, rather than a public Bitmap constructor for this decoding job. Bitmap itself holds image pixels.

**Earlier quiz correction:** Canvas.drawBitmap() is **not** a factory method. It draws an existing Bitmap; it does not create one. BitmapFactory.decodeResource() creates/decodes the object.

## 5. Observer

Observer sets up a one-to-many dependency: a subject/publisher keeps a set of observers/subscribers and notifies them when its state changes. The subject does not need to know each observer's concrete class. Observers can subscribe and unsubscribe. The book uses a weather monitoring station and newspaper subscriptions to explain this (Observer definition around printed page 51).

Typical roles:

1. Subject offers register/remove/notify operations.
2. Observer has an update operation.
3. Observers register with the Subject.
4. When the Subject changes, it notifies observers, which update themselves.

A weather station publishes measurements to multiple displays. A UI listener that responds to a button event is another intuitive event analogy. The exact Android listener code may have platform details beyond the book's generic pattern.

**Earlier quiz points recovered:** "Observer" is the pattern that notifies dependents when one subject changes; the example was a weather monitoring station; the relationship is one-to-many. One earlier question included "Handler" among choices, but its full wording was not retained. A Handler schedules Android work and is not itself the Observer pattern.

## 6. Chain of Responsibility

A request is sent to the first handler in a chain. Each handler either handles it or forwards it to a successor. The sender need not know which handler eventually acts. The book's appendix uses incoming email: spam, fan mail, complaints, and new location requests go to different handlers (printed pages 602–603). A chain can have a final catch-all handler; otherwise an unhandled request can fall off the end.

~~~java
abstract class Handler {
    Handler next;
    void setNext(Handler next) { this.next = next; }
    abstract boolean handle(Request request);
}
~~~

The sketch above states the relationship; an implementation must call next when it cannot handle a request and check whether next exists. Chain order matters. It decouples sender from receivers but can be harder to trace while debugging.

**Earlier quiz answer:** Chain of Responsibility was identified as the most recently studied pattern in that quiz context. The touch-event system was discussed as a possible handler-chain analogy, but Android's exact event dispatch rules are more detailed than this simplified pattern description.

## 7. Desktop Java and Android structure

Both environments use the Java language, objects, interfaces, inheritance, polymorphism, collections, exceptions, and design patterns. The UI frameworks and lifecycles differ.

| Desktop Swing idea | Android class/callback | Careful explanation |
| --- | --- | --- |
| JFrame | Activity | Rough screen/window analogy; Activity has system lifecycle and can host a UI |
| JPanel | View | A custom drawable UI component |
| Graphics | Canvas | Drawing operations and coordinate space |
| paintComponent(Graphics) | onDraw(Canvas) | Callback invoked when drawing is needed |

An Activity commonly represents one focused screen/task. Android creates it and calls lifecycle methods such as onCreate(). A View is a UI building block that measures, draws, and handles input. Context gives access to app resources, services, and environment information; Activity is a Context. AppCompatActivity is an AndroidX Activity subclass used in the class project.

Earlier class project details: the package was edu.byuh.mc.cis.cs300.asdfirsttry, with MainActivity.java and a custom Keena.java extending View. MainActivity created a Keena instance and called setContentView(k). Keena(Context) called super(context), and its onDraw used Canvas.drawColor(Color.BLACK). In that version, activity_main.xml was not used as the screen layout because the View was set directly in code.

The AndroidManifest.xml file is XML. The launch Activity was configured as .MainActivity with a MAIN/LAUNCHER intent filter and android:exported="true". The package/namespace and Activity reference must resolve correctly.

**Earlier quiz answers:** Android single-screen component = Activity; AndroidManifest language = XML.

### General vs Android-specific knowledge

General: packages and Java naming, classes, interfaces, inheritance, composition, nested classes, equality, loops, exceptions, polymorphism, patterns, and responsibility design.

Android-specific: Activity/Context/View lifecycles, resources and R.drawable identifiers, AndroidManifest, Toast, Handler/Looper, Android Canvas/Paint/Bitmap/BitmapFactory/RectF, density units, and touch callbacks.

## 8. Custom Views, graphics, bitmaps, scaling

A custom View extends View. Its constructor receives Context and calls super(context). Override onDraw(Canvas) for drawing. Android supplies the Canvas. After changing model state, call invalidate() to request a later redraw; do not manually call onDraw().

~~~java
class Keena extends View {
    private final Paint paint = new Paint();

    Keena(Context context) {
        super(context);
        paint.setColor(Color.BLUE);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        canvas.drawColor(Color.BLACK);
        canvas.drawCircle(getWidth() / 2f, getHeight() / 2f,
                          Math.min(getWidth(), getHeight()) * .1f, paint);
    }
}
~~~

- Canvas: operations such as drawColor, drawCircle, drawBitmap, drawText.
- Paint: color, fill/stroke style, line width, text settings, antialiasing.
- Bitmap: the actual raster pixels.
- BitmapFactory: decodes a Bitmap from a source.
- RectF: a float rectangle storing left, top, right, bottom; often destination bounds for drawing a scaled Bitmap.
- Toast: a short, transient user message, e.g. Toast.makeText(context, "Saved", Toast.LENGTH_SHORT).show().

For responsive geometry, calculate from the View/Canvas dimensions rather than assuming one device resolution. For a bitmap with original size imageW × imageH and destination area viewW × viewH, preserve aspect ratio with scale = min(viewW/imageW, viewH/imageH); then center the resulting width/height. A RectF can hold destination edges.

Resolution is physical pixel count. Density describes how pixels relate to Android's density-independent units. Standard UI dimensions commonly use dp and text sizes use sp. Raster resources can have density-qualified folders (drawable-mdpi, drawable-hdpi, drawable-xhdpi), and images are commonly placed in app/src/main/res/drawable or its qualified variants. Resource filenames use lowercase letters, digits, and underscores.

## 9. Handler, repeating events, and touch

A Handler posts Runnable work to a Looper-backed message queue. A Handler created for Looper.getMainLooper() runs posted callbacks on the UI thread. For a repeating event, a Runnable performs an update, requests a redraw, and posts itself again with a delay. Keep the same Runnable object so removeCallbacks can cancel pending executions.

~~~java
private final Handler handler = new Handler(Looper.getMainLooper());
private final Runnable tick = new Runnable() {
    @Override public void run() {
        updateGame();
        gameView.invalidate();
        handler.postDelayed(this, 16);
    }
};
// Start: handler.post(tick);
// Stop: handler.removeCallbacks(tick);
~~~

A 16 ms delay approximates 60 updates per second in ideal conditions; it is not an exact frame clock. Avoid long tasks on the UI thread. Stop the callback when the View/Activity is no longer supposed to update.

Both View and Activity provide an onTouchEvent(MotionEvent) callback that may be overridden. The same callback receives different actions; inspect event.getActionMasked() (or the appropriate action API) to distinguish ACTION_DOWN, ACTION_MOVE, ACTION_UP, and ACTION_CANCEL. A touch-down and touch-up can be handled in the same method.

**Earlier touch quiz answers:** View and Activity were the relevant classes; onTouchEvent handles both touch-down and touch-up. **Do not confuse** Android Handler scheduling with the Observer pattern.

## 10. Nested classes, local classes, anonymous classes, lambdas

A nested class is declared within another class. A **non-static inner class** instance has an implicit link to a particular enclosing instance and can directly access its instance members, including private fields. A **static nested class** has no automatic enclosing instance. It can directly access outer static members; for outer instance data, it needs an explicit object reference.

~~~java
class Game {
    private int score;
    class ScoreLabel {
        int current() { return score; }
    }
    static class Rules {
        static final int STARTING_LIVES = 3;
    }
}
// game.new ScoreLabel();  new Game.Rules();
~~~

A **local class** is declared inside a method/block. An **anonymous class** is an unnamed class expression created where needed, often to supply a listener or Runnable implementation. A **lambda** is a compact implementation of a functional interface (an interface with one abstract method). A lambda is not a kind of nested class; the whiteboard grouped it with related ways of writing local behavior. Lambdas can capture local variables only when those variables are final or effectively final.

Earlier quiz correction: a nested class is defined within another class; the two broad member-nested forms emphasized were inner and static nested. The lecture whiteboard also covered local, anonymous, and lambda forms.

## 11. Holub: responsibilities, encapsulation, CRC

Allen Holub's class discussion centered on **Tell, Don't Ask**. If an object owns the information needed for a decision, ask it to perform the work rather than pulling its internal state into another class. Objects collaborate by sending messages.

ATM example from the discussion: an ATM should call server.withdraw(amount, pin) and use the returned success/failure result. The server should validate the PIN, check the balance, update the account, and decide whether the withdrawal succeeds. If the ATM instead calls getPIN() and getBalance(), then reproduces the withdrawal rules locally, the ATM knows too much and must change whenever server rules change. In a real system PIN handling would require appropriate security practices; the classroom point is ownership of logic.

The quiz's Circle snippet fetched c.getRadius() and computed πr² in a separate method. It illustrated the same design concern: put the area behavior with Circle when area is Circle's responsibility, rather than exposing radius just so a caller can do Circle's work.

Holub did **not** say never to use getters or setters under any circumstances. The quiz answer to that absolute statement was **False**. General-purpose APIs may need to expose information to unknown clients; for application-specific classes, intent-based methods often preserve encapsulation better than routine accessors. Public instance fields are especially brittle because clients depend directly on the representation.

**CRC Cards:** Class, Responsibility, Collaborator. A card helps describe a class, the work it owns, and the other classes with which it collaborates. Earlier class material distinguished "knowing" responsibilities (state/attributes and relationships) from "doing" responsibilities (operations). In UML visibility notation, public is +, protected is #, and private is −. Attributes are normally private; operations often public when they form the intended API. A diagram should show meaningful domain behavior, not automatically list every trivial getter/setter.

**Recovered Holub quiz key:**

| Question | Correct answer | Reason |
| --- | --- | --- |
| "Holub argues you should never use getter/setter methods." | False | He critiques indiscriminate accessors, not every legitimate use. |
| Radius/area snippet violates which opinion? | "Don't ask for the information you need to do the work; ask the object that has the information to do the work for you." | Area behavior belongs with the object whose data it needs. |
| Design tool named near the end? | CRC Cards | Class, Responsibility, Collaborator. |

## 12. Java fundamentals from CS202

### Identity, equality, strings, and null

For primitives, == compares values. For object references, == tests whether two references designate the same object. equals() can test logical equality according to the class's implementation. String overrides equals(), so compare text with a.equals(b), or Objects.equals(a,b) when either side may be null. A call like a.equals(b) throws NullPointerException if a is null. String comparison with == can appear to work for interned literals, but it is the wrong general test for text equality.

If a class overrides equals(), its equals and hashCode contracts must remain consistent when used in hash collections. A null reference points to no object; dereferencing it causes a NullPointerException. Trace where the object should have been initialized or guard a legitimate absence.

### Static, methods, overloading, overriding

A static field belongs to the class and is shared; an instance field belongs to each object. A static method is called without a particular object and has no implicit this. It can use instance state only through an explicit object reference.

Overloading: same method name but different parameter lists; Java selects a matching signature at compile time. Return type alone does not overload a method. Overriding: subclass provides a compatible implementation of an inherited instance method; dynamic dispatch uses the actual object's method at runtime. @Override helps the compiler catch accidental mismatches.

A constructor initializes a new object; it is not a normal inherited method and has no return type. Constructors can be overloaded.

### Inheritance, abstract classes, interfaces, polymorphism

Superclass = base/parent class; subclass = derived/child class. Java class inheritance uses extends. super(...) calls a superclass constructor; super.method() calls an inherited implementation.

An abstract class cannot be instantiated directly. It may contain fields, implemented methods, and abstract methods. A concrete subclass must implement inherited abstract methods. An interface defines a type/contract that implementing classes promise to support; Java interfaces can also have default and static methods. A class can implement multiple interfaces but has only one direct class superclass.

Polymorphism lets one parent/interface reference hold different concrete objects. For example, a FlyBehavior variable can hold FlyWithWings or NoFlying; calling fly() chooses the actual object's implementation.

A **hook** is a method the framework/base class offers for customization. onDraw(Canvas) is a View framework hook. A **template method** calls steps in a defined order and may invoke hooks. These related terms are not identical.

### Loops, arrays, errors, and syntax

An array has fixed length and indexed elements from 0 to length − 1. Nested loops put one loop inside another; for a rectangular grid, the outer loop can choose rows and the inner loop columns. A for-each loop visits elements without exposing an index. It is useful for reading a collection, but it is not suited to every operation that needs positions or structural changes.

ConcurrentModificationException in the duck/flock exercise arose from removing ducks from the same ArrayList while a for-each loop iterated it. It does **not** necessarily imply two threads. A class discussion used Logcat to find the exception stack trace. The corrected lab approach collected hit ducks in a separate temporary list, then removed them from flock after iteration; this also handles multiple ducks hit by one tap. Iterator.remove(), a suitable removeIf(), or deferred changes are other valid patterns when their semantics fit.

~~~java
List<Duck> hit = new ArrayList<>();
for (Duck duck : flock) {
    if (duck.wasHit(x, y)) hit.add(duck);
}
flock.removeAll(hit);
~~~

An exception is a runtime signal that something went wrong. The stack trace shows type, message, and call locations; inspect the first relevant line in your own code. "Crashing is useful" in the lecture meant a clear crash often supplies a trace, not that crashes are desirable.

Syntactic sugar is more convenient syntax for an operation expressible more explicitly. The enhanced for loop is an example. Be able to trace ordinary for loops, enhanced for loops, nested loops, method calls, and object references.

## 13. Vocabulary at a glance

| Term | Meaning |
| --- | --- |
| Inner class | Non-static nested class linked to an enclosing object |
| Static nested class | Member class inside another class, with no implicit outer object |
| Local class | Class declared inside a method/block |
| Anonymous class | Unnamed class expression instantiated in place |
| Lambda | Compact implementation of a functional interface |
| Derived / child / subclass | Class extending a superclass |
| Base / parent / superclass | Class being extended |
| Interface | Contract/type implemented by classes |
| Design pattern | Reusable named design solution for a recurring problem |
| public | Broad access where the declaring type is accessible |
| private | Access within the declaring class/nest, under Java rules |
| protected | Package access plus qualifying subclass access |
| package-private | No modifier; access from the same package |
| Polymorphism | Common type, varying concrete object behavior |
| Abstract class | Incomplete class that cannot be directly instantiated |
| Abstract method | Declared without body; concrete subclass supplies implementation |
| Static method | Class-level method with no implicit this |
| Static field | Class-level variable shared across instances |
| Composition | Has-a relationship with collaborators |
| Inheritance | Is-a relationship via subclassing |
| Encapsulation | Keep representation and behavior behind a deliberate interface |
| Hook | Customization point offered by base class/framework |
| CRC | Class, Responsibility, Collaborator |
| Context | Android access to resources and environment/services |
| Activity | Android-managed screen/task component |
| View | Android UI unit for layout/drawing/input |
| Handler | Posts work to a Looper queue |
| Canvas | Drawing commands and coordinate space |
| Paint | Appearance of drawing |
| Bitmap | Raster pixels |
| BitmapFactory | Decode/create Bitmap objects from sources |
| RectF | Rectangle with floating-point edges |
| Toast | Brief transient message |

# Recovered questions and answers

These are questions or clear answer points from earlier CS300 conversations. Wording is quoted only where the available record retained it; otherwise it is paraphrased.

| Topic / question | Answer | Why |
| --- | --- | --- |
| Java package example | com.jarnaby.finance | Lowercase reversed domain-style package. |
| Android component for one UI screen | Activity | Screen-level component managed by Android. |
| AndroidManifest.xml language | XML | It declares components and configuration. |
| Swing/Android mapping | JFrame≈Activity; JPanel≈View; Graphics≈Canvas; paintComponent≈onDraw | Helpful analogies, not equivalent APIs. |
| Holub never uses getters/setters? | False | No blanket prohibition. |
| Circle radius/area Holub principle | Tell, Don't Ask | Put work with the data-owning object. |
| Holub design tool | CRC Cards | Class, Responsibility, Collaborator. |
| Simple Factory advantage | One place for instantiation/setup; less repeated code | Maintains creation logic centrally. |
| Textbook static factory | Simple factory implemented as a static method | Static describes method declaration. |
| Android Bitmap factory example | BitmapFactory.decodeResource(...) | Decodes/returns Bitmap. |
| Which is not factory creation? | Canvas.drawBitmap() | It draws, not creates. |
| Observer purpose | One-to-many notification on subject change | Subscribers are updated. |
| Observer motivating example | Weather monitoring station | Multiple displays observe measurements. |
| Strategy central idea | Encapsulate interchangeable behavior | Duck has FlyBehavior/QuackBehavior. |
| Chain central idea | Each handler handles or passes request | Sender is separated from final receiver. |
| Most recently studied pattern (earlier quiz) | Chain of Responsibility | This was the answer at that point in class. |
| Nested class | A class declared within another class | Member nested types include inner and static nested. |
| Inner vs static nested | Inner links to outer instance; static nested does not | Direct access to outer instance state differs. |
| onTouchEvent override locations | View and Activity | Both can receive touch callbacks. |
| Touch-down and touch-up | Same onTouchEvent method, different MotionEvent actions | Inspect event action. |
| Duck/flock exception | ConcurrentModificationException | Flock changed during for-each iteration. |
| Duck/flock repair | Accumulate hit ducks, remove after loop | Do not structurally change the iterated list. |

# Flashcards

Cover the answer column before reading it. Explain the answer aloud, then check.

| # | Front | Back |
| --- | --- | --- |
| 1 | What is a Java package? | Namespace grouping related types; helps organization, collisions, and access. |
| 2 | Package naming convention? | Lowercase reversed-domain style, such as com.jarnaby.finance. |
| 3 | Package statement vs import? | Declares where a type belongs vs lets a file use another type's short name. |
| 4 | What is a design pattern? | Named reusable design approach to a recurring problem. |
| 5 | Composition vs inheritance? | Has-a collaborator vs is-a subclass. |
| 6 | Strategy? | Interchangeable behavior objects behind a common interface. |
| 7 | Duck Strategy example? | Duck has FlyBehavior and delegates fly(), possibly swapping it. |
| 8 | Simple Factory? | Centralized construction, optional configuration, return of object. |
| 9 | Static factory? | Static method returning an object. |
| 10 | Factory Method vs Simple Factory? | Formal subclass creation hook vs general centralized creation idiom. |
| 11 | Android factory used in class? | BitmapFactory.decodeResource(...). |
| 12 | Why is Canvas.drawBitmap not a factory? | It draws an existing image rather than creating one. |
| 13 | Observer? | Subject notifies many observers after a change. |
| 14 | Observer example in the book? | Weather station and displays. |
| 15 | Chain of Responsibility? | Handler processes or forwards request to next handler. |
| 16 | What can happen at end of Chain? | Unhandled request falls off unless a catch-all exists. |
| 17 | JFrame/JPanel/Graphics analogy? | Activity/View/Canvas, respectively. |
| 18 | Activity? | Android-managed screen/task component with lifecycle. |
| 19 | View? | UI building block for drawing, layout, and input. |
| 20 | Context? | Access to app resources/environment/services; Activity is one. |
| 21 | What does onDraw receive? | A Canvas supplied by Android. |
| 22 | How request redraw? | Change state, then call invalidate(). |
| 23 | Canvas vs Paint? | Drawing operations vs drawing appearance. |
| 24 | Bitmap vs BitmapFactory? | Image pixels vs decoder/creator. |
| 25 | RectF? | Float edges of a rectangle. |
| 26 | Typical image folder? | app/src/main/res/drawable or density-qualified drawable folders. |
| 27 | Scale a circle across screens? | Derive center/radius from current View/Canvas dimensions. |
| 28 | How preserve bitmap aspect ratio? | Use smaller of available width and height ratios. |
| 29 | Handler repetition? | Runnable does work and calls postDelayed(this, delay) again. |
| 30 | How stop Handler callback? | removeCallbacks with the same Runnable instance. |
| 31 | Handler vs Observer? | Work scheduling vs subscriber notification design. |
| 32 | onTouchEvent down/up? | Same callback; distinguish MotionEvent action. |
| 33 | Inner class? | Nested class with implicit outer object reference. |
| 34 | Static nested class? | Nested member class without implicit outer instance. |
| 35 | Local class? | Declared inside method/block. |
| 36 | Anonymous class? | Unnamed class created in an expression. |
| 37 | Lambda? | Compact functional-interface implementation, not a nested class. |
| 38 | Holub Tell, Don't Ask? | Ask data-owning object to perform behavior. |
| 39 | ATM example? | server.withdraw(amount,pin) owns validation/update and returns success. |
| 40 | Holub getter/setter blanket statement? | False; no absolute ban. |
| 41 | CRC? | Class, Responsibility, Collaborator. |
| 42 | == vs equals on references? | Identity vs class-defined logical equality. |
| 43 | How compare Strings by content? | equals(), with null handling if needed. |
| 44 | Static field? | One class-level variable shared by objects. |
| 45 | Static method? | Class-level method without implicit this. |
| 46 | Overloading vs overriding? | Different parameter lists vs subclass implementation replacement. |
| 47 | Abstract class? | Cannot instantiate directly; may share code/state. |
| 48 | Abstract method? | Bodyless declaration implemented by concrete subclass. |
| 49 | Interface? | A type/contract implemented by classes. |
| 50 | Polymorphism? | Common reference type, differing concrete method behavior. |
| 51 | protected? | Package access plus qualifying subclass access. |
| 52 | Hook? | Framework/base method a subclass customizes, like onDraw. |
| 53 | ConcurrentModificationException? | Often structural collection change during iteration, not necessarily threads. |
| 54 | Duck/flock fix? | Collect hit ducks, remove after loop. |
| 55 | NullPointerException? | Dereference of a null reference. |
| 56 | Composite? | Treat one object and group uniformly. |
| 57 | Singleton? | Controlled shared instance. |
| 58 | Facade? | Simpler entry point to complex subsystem. |
| 59 | Template Method? | Base algorithm outline with subclass-defined steps. |
| 60 | Builder? | Stepwise construction of a complex object. |

# References

- Eric Freeman and Elisabeth Robson, *Head First Design Patterns, 2nd Edition* (attached course reference). Observer definition around printed page 51; Simple Factory discussion around page 117; Chain of Responsibility appendix around pages 602–603.
- [Android custom drawing](https://developer.android.com/develop/ui/views/layout/custom-views/custom-drawing)
- [Android View API](https://developer.android.com/reference/android/view/View)
- [Android Handler API](https://developer.android.com/reference/android/os/Handler)
- [Android BitmapFactory API](https://developer.android.com/reference/android/graphics/BitmapFactory)
- [Oracle Java OOP concepts](https://docs.oracle.com/javase/tutorial/java/concepts/)
- [Oracle packages](https://docs.oracle.com/javase/tutorial/java/package/)
- [Oracle interfaces and inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/)

