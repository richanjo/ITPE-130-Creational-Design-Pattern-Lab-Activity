"use strict";

const STORAGE_KEY = "creationalPatternsLabSession";
const RESET_CODE = "0910";

const state = {
  started: false,
  sessionLocked: false,
  completed: false,
  startTime: null,
  finalTime: null,
  currentActivity: 0,
  score: 0,
  maxScore: 100,
  studentId: "",
  section: "",
  activities: {
    singleton: { points: 20, completed: false },
    factoryMethod: { points: 20, completed: false },
    abstractFactory: { points: 20, completed: false },
    builder: { points: 20, completed: false },
    prototype: { points: 20, completed: false }
  }
};

const editorValues = {};
let timerId = null;
let validating = false;

const TASK_STEPS = [
  "Read the Scenario and the Learning Objective.",
  "Review the Provided Code \u2014 it is already completed and must NOT be rewritten.",
  "Complete only the PHP code in the Student Answer section below.",
  "Click Run Code when you are ready.",
  "Review the automated test results.",
  "Fix any failed tests and run the code again.",
  "All tests must pass to earn the points for this pattern.",
  "Click Next Pattern to continue."
];

const ACTIVITIES = [
  {
    id: "singleton",
    number: 1,
    pattern: "Singleton",
    title: "Coordinator Activity Logger",
    points: 20,
    scenario: "The Coordinator performs many actions while preparing subject offerings: creating subjects, assigning schedules, assigning rooms, assigning faculty, and setting capacity. The system needs one centralized logger so that all Coordinator activities are recorded in a single place. The Singleton must represent CoordinatorLogger only \u2014 it must NOT represent a student login, a coordinator login, or the current student.",
    objective: "Understand that the Singleton pattern ensures only one instance of a class exists and provides a single global access point to it.",
    systemUsage: [
      "CoordinatorLogger::getInstance() is used by every part of the system.",
      "Every coordinator action is recorded through the one shared logger.",
      "Calling getInstance() twice always returns the very same object."
    ],
    providedNote: "This is the CoordinatorLogger class. The getInstance() method still needs its Singleton logic \u2014 that is your Student Answer section.",
    editorTall: false,
    providedCode: `<?php

class CoordinatorLogger
{
    private static ?CoordinatorLogger $instance = null;

    private array $logs = [];

    private function __construct()
    {
    }

    public static function getInstance(): CoordinatorLogger
    {
        // Student Answer
        if (self::$instance === null) {
            ______________________________;
        }

        return __________________;
    }

    public function log(
        string $coordinatorId,
        string $action,
        string $details
    ): void {

        $this->logs[] = [
            "coordinator_id" => $coordinatorId,
            "action" => $action,
            "details" => $details,
            "datetime" => date("Y-m-d H:i:s")
        ];
    }

    public function getLogs(): array
    {
        return $this->logs;
    }
}`,
    answerInit: `public static function getInstance(): CoordinatorLogger
{
    // Student Answer
    if (self::$instance === null) {
        // TODO: Create and assign the new CoordinatorLogger instance.
    }

    // TODO: Return the stored singleton instance.
    return ____;
}`,
    hint: `<strong>Hint</strong>
<p>Only one CoordinatorLogger instance may ever exist.</p>
<p>When getInstance() is called and the static $instance property is still null, create a new CoordinatorLogger once: self::$instance = new CoordinatorLogger();</p>
<p>Then always return the stored $instance \u2014 never a brand new logger.</p>`,
    expectedOutput: `Logger instance ............. CoordinatorLogger (only one exists)
Same instance returned ...... YES ($logger1 === $logger2)

Recorded activity:
  coordinator_id => COORD-001
  action         => CREATE SUBJECT
  details        => IT202 - Web Development
  datetime       => 2026-09-23 10:15:32`,
    validate: validateSingleton
  },
  {
    id: "factoryMethod",
    number: 2,
    pattern: "Factory Method",
    title: "Subject Creation",
    points: 20,
    scenario: "The university offers different subject types: Lecture, Laboratory, and Lecture + Laboratory. The system must create the correct Subject object. Instead of scattering new LectureSubject() calls across the client code, the Factory Method pattern centralizes creation inside dedicated factory classes.",
    objective: "Understand that the Factory Method pattern defines an interface or abstract factory for creating an object, and lets subclasses decide which concrete product to instantiate.",
    systemUsage: [
      "The Coordinator asks a factory for a Subject instead of hard-coding new.",
      "Lecture, Laboratory, and Lecture + Laboratory each have a dedicated factory.",
      "Adding a new subject type means adding a new concrete factory."
    ],
    providedNote: "The Subject interface and the three concrete subjects are already completed. You do NOT need to rewrite them. Your task is to write the concrete factory classes in the Student Answer section.",
    editorTall: true,
    providedCode: `interface Subject
{
    public function getType(): string;
    public function getDetails(): string;
}


class LectureSubject implements Subject
{
    public function getType(): string
    {
        return "Lecture";
    }

    public function getDetails(): string
    {
        return "Lecture-based subject";
    }
}


class LaboratorySubject implements Subject
{
    public function getType(): string
    {
        return "Laboratory";
    }

    public function getDetails(): string
    {
        return "Laboratory-based subject";
    }
}


class LectureLaboratorySubject implements Subject
{
    public function getType(): string
    {
        return "Lecture + Laboratory";
    }

    public function getDetails(): string
    {
        return "Lecture and laboratory subject";
    }
}`,
    answerInit: `abstract class SubjectFactory
{
    abstract public function createSubject(): Subject;
}


// ----------------------------------------------------------------------
// WRITE THE THREE CONCRETE FACTORY CLASSES BELOW
// ----------------------------------------------------------------------
//
// Each factory class must:
//   1) extend SubjectFactory
//   2) declare:  public function createSubject(): Subject
//   3) return the matching concrete Subject inside createSubject()
//
//  LectureSubjectFactory
//      -> createSubject() returns new LectureSubject();
//
//  LaboratorySubjectFactory
//      -> createSubject() returns new LaboratorySubject();
//
//  LectureLaboratorySubjectFactory
//      -> createSubject() returns new LectureLaboratorySubject();
// ----------------------------------------------------------------------`,
    answerNote: "Your Task: write the three concrete factory classes below \u2014 LectureSubjectFactory, LaboratorySubjectFactory, and LectureLaboratorySubjectFactory. Each class must extend SubjectFactory and its createSubject() must return the matching concrete Subject.",
    hint: `<strong>Hint</strong>
<p>Each factory class extends SubjectFactory and overrides createSubject(): Subject.</p>
<p>LectureSubjectFactory must return new LectureSubject(), LaboratorySubjectFactory must return new LaboratorySubject(), and LectureLaboratorySubjectFactory must return new LectureLaboratorySubject().</p>
<p>Look at each factory's class name to decide which concrete Subject it should create.</p>`,
    expectedOutput: `LectureSubjectFactory->createSubject()
    => LectureSubject (Lecture-based subject)

LaboratorySubjectFactory->createSubject()
    => LaboratorySubject (Laboratory-based subject)

LectureLaboratorySubjectFactory->createSubject()
    => LectureLaboratorySubject (Lecture and laboratory subject)

Each factory returns the correct concrete Subject product.`,
    validate: validateFactoryMethod
  },
  {
    id: "abstractFactory",
    number: 3,
    pattern: "Abstract Factory",
    title: "Subject Offering Components",
    points: 20,
    scenario: "A Subject Offering is composed of several related components: the Subject, the Schedule, the Room, and the Faculty. Instead of creating each component independently, an Abstract Factory creates the whole family of components together so that the pieces always match.",
    objective: "Understand that the Abstract Factory pattern creates families of related products without the client knowing their concrete classes.",
    systemUsage: [
      "The offering factory assembles one matching Subject, Schedule, Room, and Faculty.",
      "Every component created comes from the same factory \u2014 the same family.",
      "Swapping the factory swaps all four components consistently."
    ],
    providedNote: "The four component interfaces (OfferingSubject, OfferingSchedule, OfferingRoom, OfferingFaculty) and the four regular components (RegularSubject, RegularSchedule, RegularRoom, RegularFaculty) are already provided \u2014 do NOT rewrite them. Your task: (1) write the concrete factory class RegularSubjectOfferingFactory, then (2) TEST it by creating the factory and calling each create method with the given values.",
    editorTall: true,
    providedCode: `interface OfferingSubject
{
    public function getName(): string;
}

interface OfferingSchedule
{
    public function getSchedule(): string;
}

interface OfferingRoom
{
    public function getRoom(): string;
}

interface OfferingFaculty
{
    public function getFaculty(): string;
}


class RegularSubject implements OfferingSubject
{
    public function __construct(
        private string $name
    ) {
    }

    public function getName(): string
    {
        return $this->name;
    }
}


class RegularSchedule implements OfferingSchedule
{
    public function __construct(
        private string $schedule
    ) {
    }

    public function getSchedule(): string
    {
        return $this->schedule;
    }
}


class RegularRoom implements OfferingRoom
{
    public function __construct(
        private string $room
    ) {
    }

    public function getRoom(): string
    {
        return $this->room;
    }
}


class RegularFaculty implements OfferingFaculty
{
    public function __construct(
        private string $faculty
    ) {
    }

    public function getFaculty(): string
    {
        return $this->faculty;
    }
}`,
    answerInit: `interface SubjectOfferingFactory
{
    public function createSubject(
        string $name
    ): OfferingSubject;

    public function createSchedule(
        string $schedule
    ): OfferingSchedule;

    public function createRoom(
        string $room
    ): OfferingRoom;

    public function createFaculty(
        string $faculty
    ): OfferingFaculty;
}


// ----------------------------------------------------------------------
// WRITE THE CONCRETE FACTORY CLASS BELOW
// ----------------------------------------------------------------------
//
//  Write: class RegularSubjectOfferingFactory implements SubjectOfferingFactory
//
//  Inside the class, implement these four methods and hand back the
//  matching regular component from each one:
//
//  createSubject(string $name)      -> new RegularSubject($name)
//  createSchedule(string $schedule) -> new RegularSchedule($schedule)
//  createRoom(string $room)         -> new RegularRoom($room)
//  createFaculty(string $faculty)   -> new RegularFaculty($faculty)
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// TEST THE FACTORY BELOW
// ----------------------------------------------------------------------
//
//  Make a variable named $factory and store a new
//  RegularSubjectOfferingFactory in it. Then call every create method
//  and pass the value shown for each component:
//
//  subject name  -> "Web Development"
//  schedule      -> "MWF 8:00 AM - 9:00 AM"
//  room          -> "Room 301"
//  faculty       -> "Juan Dela Cruz"
// ----------------------------------------------------------------------`,
    answerNote: "Your Task has TWO parts. (1) Write the concrete factory class RegularSubjectOfferingFactory implements SubjectOfferingFactory \u2014 implement all four create methods so each one returns the matching Regular component (createSubject() returns new RegularSubject($name), createSchedule() returns new RegularSchedule($schedule), createRoom() returns new RegularRoom($room), createFaculty() returns new RegularFaculty($faculty)). (2) TEST the factory: create $factory = new RegularSubjectOfferingFactory(); then call each create method passing a real value \u2014 createSubject(\"Web Development\"), createSchedule(\"MWF 8:00 AM - 9:00 AM\"), createRoom(\"Room 301\"), and createFaculty(\"Juan Dela Cruz\").",
    hint: `<strong>Hint</strong>
<p><strong>Step 1 \u2014 Write the concrete factory.</strong> Make RegularSubjectOfferingFactory implement SubjectOfferingFactory and implement all four create methods. Each one must return the matching regular component, passing the method's own parameter into that component's constructor: createSubject($name) returns new RegularSubject($name), createSchedule($schedule) returns new RegularSchedule($schedule), createRoom($room) returns new RegularRoom($room), and createFaculty($faculty) returns new RegularFaculty($faculty).</p>
<p><strong>Step 2 \u2014 Test it.</strong> Build $factory = new RegularSubjectOfferingFactory(); then call $factory->createSubject("Web Development"), $factory->createSchedule("MWF 8:00 AM - 9:00 AM"), $factory->createRoom("Room 301"), and $factory->createFaculty("Juan Dela Cruz").</p>
<p>Every component must come from the same factory so they always match as one family.</p>`,
    expectedOutput: `$factory = new RegularSubjectOfferingFactory();

Subject  -> OfferingSubject  : Web Development
Schedule -> OfferingSchedule : MWF 8:00 AM - 9:00 AM
Room     -> OfferingRoom     : Room 301
Faculty  -> OfferingFaculty  : Juan Dela Cruz

All four components come from the same family.`,
    validate: validateAbstractFactory
  },
  {
    id: "builder",
    number: 4,
    pattern: "Builder",
    title: "Build a Complete Subject Offering",
    points: 20,
    scenario: "A complete Subject Offering contains many pieces of information: Academic Year, Semester, Subject Code, Subject Name, Subject Type, Section, Schedule, Room, Faculty, and Capacity. The Builder pattern lets the Coordinator construct the offering step by step, chaining one setter after another.",
    objective: "Understand that the Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations.",
    systemUsage: [
      "The Coordinator builds the offering piece by piece.",
      "Each setter returns $this so the calls can be chained.",
      "build() finally hands back the complete SubjectOffering."
    ],
    providedNote: "The SubjectOffering class is provided \u2014 it stores the data and has a display() method. Your task has TWO parts: (1) write the whole SubjectOfferingBuilder class from scratch (the private property, the constructor, all ten setters, and build()), then (2) TEST it by chaining every setter with the given values and calling build() then display().",
    editorTall: true,
    providedCode: `class SubjectOffering
{
    public array $data = [];

    public function display(): void
    {
        echo "<pre>";
        print_r($this->data);
        echo "</pre>";
    }
}`,
    answerInit: `// ----------------------------------------------------------------------
// WRITE THE BUILDER CLASS BELOW
// ----------------------------------------------------------------------
//
//  Objective: create a builder named SubjectOfferingBuilder that wraps
//  one private SubjectOffering $offering property.
//
//  The constructor must build a fresh SubjectOffering and store it in
//  the property.
//
//  The ten setters each take the matching value and store it in the
//  offering data under the matching key:
//
//  setAcademicYear -> key "academicYear"
//  setSemester     -> key "semester"
//  setSubjectCode  -> key "subjectCode"
//  setSubjectName  -> key "subjectName"
//  setSubjectType  -> key "subjectType"
//  setSection      -> key "section"
//  setSchedule     -> key "schedule"
//  setRoom         -> key "room"
//  setFaculty      -> key "faculty"
//  setCapacity     -> key "capacity"   (int)
//
//  Every setter must finish by handing back the builder itself so the
//  calls can be chained one after another.
//
//  A final build() hands back the completed offering.
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// TEST THE BUILDER BELOW
// ----------------------------------------------------------------------
//
//  Chain every setter on a brand-new builder and pass each value,
//  then call build() and display(). Use these values:
//
//  academicYear -> "2026-2027"
//  semester     -> "1st Semester"
//  subjectCode  -> "IT202"
//  subjectName  -> "Web Development"
//  subjectType  -> "Lecture"
//  section      -> "BSIT-2A"
//  schedule     -> "MWF 8:00 AM - 9:00 AM"
//  room         -> "Room 301"
//  faculty      -> "Juan Dela Cruz"
//  capacity     -> 40
// ----------------------------------------------------------------------`,
    answerNote: "Your Task has TWO parts. (1) Write the whole SubjectOfferingBuilder class from scratch: a private SubjectOffering $offering property, a __construct() that sets $this->offering = new SubjectOffering(), all ten setters (each one stores its value into $this->offering->data under the matching key, then returns $this), and a build(): SubjectOffering that returns $this->offering. (2) TEST the builder by chaining every setter on a new builder with the given values (\"2026-2027\", \"1st Semester\", \"IT202\", \"Web Development\", \"Lecture\", \"BSIT-2A\", \"MWF 8:00 AM - 9:00 AM\", \"Room 301\", \"Juan Dela Cruz\", 40), then end the chain with ->build() and call ->display();",
    hint: `<strong>Hint</strong>
<p><strong>Step 1 \u2014 Write the builder class.</strong> SubjectOfferingBuilder holds private SubjectOffering $offering. Its __construct() does $this->offering = new SubjectOffering(). Write all ten setters \u2014 each one takes a value, stores it into $this->offering->data under the matching key, then finishes with return $this;. Write build(): SubjectOffering that hands back $this->offering.</p>
<p><strong>Step 2 \u2014 Test it.</strong> Chain every setter on a fresh builder passing "2026-2027", "1st Semester", "IT202", "Web Development", "Lecture", "BSIT-2A", "MWF 8:00 AM - 9:00 AM", "Room 301", "Juan Dela Cruz", and 40, then call build() and display().</p>
<p>Every setter returning $this is what makes the long chain possible.</p>`,
    expectedOutput: `(new SubjectOfferingBuilder())
    ->setAcademicYear("2026-2027")
    ->setSemester("1st Semester")
    ->setSubjectCode("IT202")
    ->setSubjectName("Web Development")
    ->setSubjectType("Lecture")
    ->setSection("BSIT-2A")
    ->setSchedule("MWF 8:00 AM - 9:00 AM")
    ->setRoom("Room 301")
    ->setFaculty("Juan Dela Cruz")
    ->setCapacity(40)
    ->build()
    ->display();

SubjectOffering data:
  academicYear => 2026-2027
  semester     => 1st Semester
  subjectCode  => IT202
  subjectName  => Web Development
  subjectType  => Lecture
  section      => BSIT-2A
  schedule     => MWF 8:00 AM - 9:00 AM
  room         => Room 301
  faculty      => Juan Dela Cruz
  capacity     => 40`,
    validate: validateBuilder
  },
  {
    id: "prototype",
    number: 5,
    pattern: "Prototype",
    title: "Clone a Subject Offering",
    points: 20,
    scenario: "The Coordinator already created section BSIT-2A of IT202 \u2014 Web Development. The department also needs section BSIT-2B. Instead of constructing a completely new Subject Offering from scratch, the Coordinator clones the existing one and adjusts a few properties.",
    objective: "Understand that the Prototype pattern copies existing objects instead of constructing new ones, and that PHP provides the clone keyword to create such copies.",
    systemUsage: [
      "BSIT-2A already exists with schedule, room, and faculty assigned.",
      "BSIT-2B is created by cloning BSIT-2A and tweaking a few values.",
      "The original offering BSIT-2A stays untouched."
    ],
    providedNote: "The complete SubjectOfferingPrototype class and the original BSIT-2A object are provided. You only complete the cloning and the modifications.",
    editorTall: false,
    providedCode: `class SubjectOfferingPrototype
{
    public string $academicYear;
    public string $semester;
    public string $subjectCode;
    public string $subjectName;
    public string $subjectType;
    public string $section;
    public string $schedule;
    public string $room;
    public string $faculty;
    public int $capacity;

    public function __construct(
        string $academicYear,
        string $semester,
        string $subjectCode,
        string $subjectName,
        string $subjectType,
        string $section,
        string $schedule,
        string $room,
        string $faculty,
        int $capacity
    ) {
        $this->academicYear = $academicYear;
        $this->semester = $semester;
        $this->subjectCode = $subjectCode;
        $this->subjectName = $subjectName;
        $this->subjectType = $subjectType;
        $this->section = $section;
        $this->schedule = $schedule;
        $this->room = $room;
        $this->faculty = $faculty;
        $this->capacity = $capacity;
    }
}


$sectionA = new SubjectOfferingPrototype(
    "2026-2027",
    "1st Semester",
    "IT202",
    "Web Development",
    "Lecture",
    "BSIT-2A",
    "MWF 8:00 AM - 9:00 AM",
    "Room 301",
    "Juan Dela Cruz",
    40
);`,
    answerInit: `// TODO 1: Clone the existing subject offering (copy $sectionA).
// Copy the existing object so the original stays untouched.

$sectionB = ____;


// TODO 2: Change the section.
// The new section must be: "BSIT-2B"

$sectionB->section = ____;


// TODO 3: Change the schedule.
// The new schedule must be: "TTh 10:00 AM - 11:30 AM"

$sectionB->schedule = ____;


// TODO 4: Change the room.
// The new room must be: "Room 302"

$sectionB->room = ____;


// TODO 5: Change the faculty.
// The new faculty must be the professor teaching this subject
// (the one who developed this laboratory).

$sectionB->faculty = ____;`,
    answerNote: "Your task: clone the existing subject offering, then change EXACTLY these four properties on the clone $sectionB: section -> \"BSIT-2B\", schedule -> \"TTh 10:00 AM - 11:30 AM\", room -> \"Room 302\", faculty -> the professor of this subject (the one who developed this laboratory). The original $sectionA must keep its unchanged values: BSIT-2A, MWF 8:00 AM - 9:00 AM, Room 301, and its original faculty.",
    hint: `<strong>Hint</strong>
<p>PHP provides the clone keyword \u2014 use it to copy the existing offering into $sectionB.</p>
<p>Then change exactly four properties on $sectionB with these changes:</p>
<ul>
<li>section -> "BSIT-2B"</li>
<li>schedule -> "TTh 10:00 AM - 11:30 AM"</li>
<li>room -> "Room 302"</li>
<li>faculty -> the exact faculty name of this subject (the laboratory developer)</li>
</ul>
<p>The clone is a separate object \u2014 the original $sectionA must never be modified.</p>`,
    expectedOutput: `Original offering (unchanged):
  section  => BSIT-2A
  schedule => MWF 8:00 AM - 9:00 AM
  room     => Room 301
  faculty  => Juan Dela Cruz

Cloned offering ($sectionB):
  section  => BSIT-2B
  schedule => TTh 10:00 AM - 11:30 AM
  room     => Room 302
  faculty  => (the faculty of this subject)

The clone is a separate object; the original was not modified.`,
    validate: validatePrototype
  }
];

/* ------------------------------------------------------------------------ */
/* Utilities                                                                */
/* ------------------------------------------------------------------------ */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightPhp(code) {
  const tokenRe = /(\/\*[\s\S]*?\*\/)|(\/\/[^\n]*)|(#[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|(\$\w+)|(\b(?:abstract|class|interface|extends|implements|public|private|protected|static|final|function|return|new|echo|if|else|elseif|self|parent|const|var|true|false|null|array|string|int|float|bool|void|mixed|instanceof|foreach|for|while|switch|case|break|default|__construct|__clone)\b)|(\b\d+\b)|(<\?php|\?>)/g;
  let html = "";
  let last = 0;
  let m;
  tokenRe.lastIndex = 0;
  while ((m = tokenRe.exec(code)) !== null) {
    html += escapeHtml(code.slice(last, m.index));
    if (m[1]) html += '<span class="tok-comment">' + escapeHtml(m[1]) + "</span>";
    else if (m[2]) html += '<span class="tok-comment">' + escapeHtml(m[2]) + "</span>";
    else if (m[3]) html += '<span class="tok-comment">' + escapeHtml(m[3]) + "</span>";
    else if (m[4]) html += '<span class="tok-string">' + escapeHtml(m[4]) + "</span>";
    else if (m[5]) html += '<span class="tok-var">' + escapeHtml(m[5]) + "</span>";
    else if (m[6]) html += '<span class="tok-keyword">' + escapeHtml(m[6]) + "</span>";
    else if (m[7]) html += '<span class="tok-number">' + escapeHtml(m[7]) + "</span>";
    else if (m[8]) html += '<span class="tok-tag">' + escapeHtml(m[8]) + "</span>";
    last = m.index + m[0].length;
  }
  html += escapeHtml(code.slice(last));
  return html;
}

function normWs(text) {
  return String(text).replace(/\s+/g, "");
}

function reWs(re) {
  const src = re && typeof re.source === "string" ? re.source : String(re);
  return new RegExp(
    src
      .replace(/\\b/g, "")
      .replace(/\\s[*+?]?/g, "")
      .replace(/\s+/g, "")
  );
}

function wsTest(text, re) {
  return reWs(re).test(normWs(text));
}

function has(code, re) {
  return wsTest(code, re);
}

function t(name, pass, detail) {
  return { name: name, pass: !!pass, detail: pass ? "" : (detail || "") };
}

function sliceFrom(code, startRe) {
  const m = startRe.exec(code);
  return m ? code.slice(m.index) : null;
}

function methodBody(code, name) {
  const re = new RegExp("function\\s+" + name + "\\s*\\([^)]*\\)\\s*:\\s*self\\s*\\{");
  const m = re.exec(code);
  if (!m) return null;
  let i = m.index + m[0].length - 1;
  let depth = 1;
  while (i < code.length - 1 && depth > 0) {
    i++;
    const c = code[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
  }
  return code.slice(m.index, i + 1);
}

/* ------------------------------------------------------------------------ */
/* Validators                                                               */
/* ------------------------------------------------------------------------ */

function validateSingleton(answer, full) {
  const tests = [];
  tests.push(t(
    "CoordinatorLogger exists",
    has(full, "class\\s+CoordinatorLogger\\b"),
    "Expected: class CoordinatorLogger"
  ));
  tests.push(t(
    "Static instance exists",
    has(full, "static\\s+\\?CoordinatorLogger\\s+\\$instance") || has(full, "static\\s+\\$instance"),
    "Expected: a private static $instance property in CoordinatorLogger"
  ));
  tests.push(t(
    "Constructor is private",
    has(full, "private\\s+function\\s+__construct"),
    "Expected: private function __construct()"
  ));
  tests.push(t(
    "getInstance() exists",
    has(full, "(public\\s+)?static\\s+function\\s+getInstance\\s*\\("),
    "Expected: public static function getInstance()"
  ));
  tests.push(t(
    "Instance is assigned inside the null check",
    has(full, "self::\\$instance\\s*=\\s*new\\s+CoordinatorLogger\\s*\\(\\s*\\)") && has(full, "self::\\$instance\\s*===\\s*null"),
    "Inside the null check write: self::$instance = new CoordinatorLogger();"
  ));
  tests.push(t(
    "Existing instance is returned",
    has(answer, "return\\s+self::\\$instance\\s*;?"),
    "Write: return self::$instance;"
  ));
  tests.push(t(
    "Logger can record activity",
    has(full, "function\\s+log\\s*\\("),
    "Expected: a log() method that pushes an entry into $logs"
  ));
  tests.push(t(
    "getLogs() exists",
    has(full, "function\\s+getLogs\\s*\\("),
    "Expected: a getLogs() method returning the array of logs"
  ));
  tests.push(t(
    "Same instance is returned (Singleton)",
    has(full, "self::\\$instance\\s*=\\s*new\\s+CoordinatorLogger") && has(full, "return\\s+self::\\$instance"),
    "Create the instance once, then always return the static instance."
  ));
  return tests;
}

function classBlock(code, className) {
  const re = new RegExp("class\\s+" + className + "\\s+extends\\s+SubjectFactory", "m");
  const start = re.exec(code);
  if (!start) return null;
  const nextClassRe = /\n\s*class\s+\w+Factory\b/g;
  nextClassRe.lastIndex = start.index + start[0].length;
  const next = nextClassRe.exec(code);
  const end = next ? next.index : code.length;
  return code.slice(start.index, end);
}

function validateFactoryMethod(answer, full) {
  const factDefs = [
    { cls: "LectureSubjectFactory", product: "LectureSubject" },
    { cls: "LaboratorySubjectFactory", product: "LaboratorySubject" },
    { cls: "LectureLaboratorySubjectFactory", product: "LectureLaboratorySubject" }
  ];
  const tests = [];

  tests.push(t("Subject interface exists", has(full, "interface\\s+Subject\\b"), "Expected: interface Subject"));
  tests.push(t("LectureSubject exists", has(full, "class\\s+LectureSubject\\b"), "Expected: class LectureSubject implements Subject"));
  tests.push(t("LaboratorySubject exists", has(full, "class\\s+LaboratorySubject\\b"), "Expected: class LaboratorySubject implements Subject"));
  tests.push(t(
    "LectureLaboratorySubject exists",
    has(full, "class\\s+LectureLaboratorySubject\\b"),
    "Expected: class LectureLaboratorySubject implements Subject"
  ));
  tests.push(t(
    "SubjectFactory exists",
    has(answer, "(abstract\\s+)?class\\s+SubjectFactory\\b"),
    "Expected: abstract class SubjectFactory with abstract createSubject(): Subject"
  ));

  factDefs.forEach(function (def) {
    const block = classBlock(answer, def.cls);
    tests.push(t(
      def.cls + " exists and extends SubjectFactory",
      !!block,
      "Write: class " + def.cls + " extends SubjectFactory { ... }"
    ));
    const exists = !!block;
    tests.push(t(
      def.cls + " createSubject() exists",
      exists && wsTest(block, /function\s+createSubject\s*\([^)]*\)\s*:\s*Subject/),
      "Declare: public function createSubject(): Subject inside " + def.cls
    ));
    tests.push(t(
      def.cls + " creates " + def.product,
      exists && wsTest(block, new RegExp("return\\s+new\\s+" + def.product + "\\s*\\(\\s*\\)\\s*;?")),
      "Inside createSubject() write: return new " + def.product + "();"
    ));
  });

  return tests;
}

function validateAbstractFactory(answer, full) {
  const factoryBlock = sliceFrom(answer, /class\s+RegularSubjectOfferingFactory\b/);
  const classOk = !!factoryBlock;
  const tests = [];
  tests.push(t("OfferingSubject interface exists", has(full, "interface\\s+OfferingSubject\\b"), "Expected: interface OfferingSubject"));
  tests.push(t("OfferingSchedule interface exists", has(full, "interface\\s+OfferingSchedule\\b"), "Expected: interface OfferingSchedule"));
  tests.push(t("OfferingRoom interface exists", has(full, "interface\\s+OfferingRoom\\b"), "Expected: interface OfferingRoom"));
  tests.push(t("OfferingFaculty interface exists", has(full, "interface\\s+OfferingFaculty\\b"), "Expected: interface OfferingFaculty"));
  tests.push(t("RegularSubject exists", has(full, "class\\s+RegularSubject\\b"), "Expected: class RegularSubject"));
  tests.push(t("RegularSchedule exists", has(full, "class\\s+RegularSchedule\\b"), "Expected: class RegularSchedule"));
  tests.push(t("RegularRoom exists", has(full, "class\\s+RegularRoom\\b"), "Expected: class RegularRoom"));
  tests.push(t("RegularFaculty exists", has(full, "class\\s+RegularFaculty\\b"), "Expected: class RegularFaculty"));
  tests.push(t(
    "SubjectOfferingFactory exists",
    has(answer, "interface\\s+SubjectOfferingFactory\\b"),
    "Expected: interface SubjectOfferingFactory with the four create methods"
  ));
  tests.push(t(
    "RegularSubjectOfferingFactory exists and implements SubjectOfferingFactory",
    has(answer, "class\\s+RegularSubjectOfferingFactory\\b[^{]*implements\\s+SubjectOfferingFactory"),
    "Write: class RegularSubjectOfferingFactory implements SubjectOfferingFactory { ... }"
  ));
  tests.push(t(
    "createSubject() declared",
    classOk && wsTest(factoryBlock, /function\s+createSubject\s*\(\s*string\s+\$name\s*\)\s*:\s*OfferingSubject/),
    "Declare: public function createSubject(string $name): OfferingSubject inside the factory"
  ));
  tests.push(t(
    "createSchedule() declared",
    classOk && wsTest(factoryBlock, /function\s+createSchedule\s*\(\s*string\s+\$schedule\s*\)\s*:\s*OfferingSchedule/),
    "Declare: public function createSchedule(string $schedule): OfferingSchedule inside the factory"
  ));
  tests.push(t(
    "createRoom() declared",
    classOk && wsTest(factoryBlock, /function\s+createRoom\s*\(\s*string\s+\$room\s*\)\s*:\s*OfferingRoom/),
    "Declare: public function createRoom(string $room): OfferingRoom inside the factory"
  ));
  tests.push(t(
    "createFaculty() declared",
    classOk && wsTest(factoryBlock, /function\s+createFaculty\s*\(\s*string\s+\$faculty\s*\)\s*:\s*OfferingFaculty/),
    "Declare: public function createFaculty(string $faculty): OfferingFaculty inside the factory"
  ));
  const allFour =
    classOk &&
    wsTest(factoryBlock, /return\s+new\s+RegularSubject\s*\(\s*\$name\s*\)\s*;?/) &&
    wsTest(factoryBlock, /return\s+new\s+RegularSchedule\s*\(\s*\$schedule\s*\)\s*;?/) &&
    wsTest(factoryBlock, /return\s+new\s+RegularRoom\s*\(\s*\$room\s*\)\s*;?/) &&
    wsTest(factoryBlock, /return\s+new\s+RegularFaculty\s*\(\s*\$faculty\s*\)\s*;?/);
  tests.push(t(
    "Correct related products are returned",
    allFour,
    "Each create method must return the matching regular product and pass its own argument."
  ));
  tests.push(t(
    "Factory is instantiated for testing",
    has(answer, "\\$factory\\s*=\\s*new\\s+RegularSubjectOfferingFactory\\s*\\(\\s*\\)"),
    "Create: $factory = new RegularSubjectOfferingFactory();"
  ));
  tests.push(t(
    "createSubject() is called with a real value",
    has(answer, "\\$factory->createSubject\\s*\\(\\s*\"Web Development\"\\s*\\)"),
    "Call: $factory->createSubject(\"Web Development\")"
  ));
  tests.push(t(
    "createSchedule() is called with a real value",
    has(answer, "\\$factory->createSchedule\\s*\\(\\s*\"MWF 8:00 AM - 9:00 AM\"\\s*\\)"),
    "Call: $factory->createSchedule(\"MWF 8:00 AM - 9:00 AM\")"
  ));
  tests.push(t(
    "createRoom() is called with a real value",
    has(answer, "\\$factory->createRoom\\s*\\(\\s*\"Room 301\"\\s*\\)"),
    "Call: $factory->createRoom(\"Room 301\")"
  ));
  tests.push(t(
    "createFaculty() is called with a real value",
    has(answer, "\\$factory->createFaculty\\s*\\(\\s*\"Juan Dela Cruz\"\\s*\\)"),
    "Call: $factory->createFaculty(\"Juan Dela Cruz\")"
  ));
  return tests;
}

function validateBuilder(answer, full) {
  const tests = [];
  const setters = [
    { fn: "setAcademicYear", field: "academicYear", param: "academicYear" },
    { fn: "setSemester", field: "semester", param: "semester" },
    { fn: "setSubjectCode", field: "subjectCode", param: "subjectCode" },
    { fn: "setSubjectName", field: "subjectName", param: "subjectName" },
    { fn: "setSubjectType", field: "subjectType", param: "subjectType" },
    { fn: "setSection", field: "section", param: "section" },
    { fn: "setSchedule", field: "schedule", param: "schedule" },
    { fn: "setRoom", field: "room", param: "room" },
    { fn: "setFaculty", field: "faculty", param: "faculty" },
    { fn: "setCapacity", field: "capacity", param: "capacity" }
  ];
  const usage = [
    { fn: "setAcademicYear", value: "\"2026-2027\"" },
    { fn: "setSemester", value: "\"1st Semester\"" },
    { fn: "setSubjectCode", value: "\"IT202\"" },
    { fn: "setSubjectName", value: "\"Web Development\"" },
    { fn: "setSubjectType", value: "\"Lecture\"" },
    { fn: "setSection", value: "\"BSIT-2A\"" },
    { fn: "setSchedule", value: "\"MWF 8:00 AM - 9:00 AM\"" },
    { fn: "setRoom", value: "\"Room 301\"" },
    { fn: "setFaculty", value: "\"Juan Dela Cruz\"" },
    { fn: "setCapacity", value: "40" }
  ];
  const builderBlock = sliceFrom(answer, /class\s+SubjectOfferingBuilder\b/);
  const blockOk = !!builderBlock;

  tests.push(t("SubjectOffering exists", has(full, "class\\s+SubjectOffering\\b"), "Expected: class SubjectOffering (already provided)"));
  tests.push(t(
    "SubjectOfferingBuilder exists",
    has(answer, "class\\s+SubjectOfferingBuilder\\b"),
    "Write: class SubjectOfferingBuilder { ... }"
  ));
  tests.push(t(
    "Builder holds a private SubjectOffering",
    blockOk && wsTest(builderBlock, /\$offering\b/),
    "Add: private SubjectOffering $offering;"
  ));
  tests.push(t(
    "__construct() creates the offering",
    blockOk && has(builderBlock, "function\\s+__construct\\s*\\(") && wsTest(builderBlock, /\$this->offering\s*=\s*new\s+SubjectOffering\s*\(\s*\)/),
    "In __construct(): $this->offering = new SubjectOffering();"
  ));

  setters.forEach(function (item) {
    const body = methodBody(answer, item.fn);
    const assignRe = new RegExp('data\\["' + item.field + '"\\]\\s*=\\s*\\$' + item.param + "\\s*;");
    tests.push(t(
      item.fn + "() stores and returns $this",
      !!body && wsTest(body, assignRe) && wsTest(body, /return\s+\$this\s*;?/),
      "In " + item.fn + "(): $this->offering->data[\"" + item.field + "\"] = $" + item.param + "; then return $this;"
    ));
  });

  let chainCount = 0;
  setters.forEach(function (item) {
    const body = methodBody(answer, item.fn) || "";
    if (wsTest(body, /return\s+\$this\s*;?/)) chainCount++;
  });
  tests.push(t(
    "All setters return $this for chaining",
    chainCount >= 10,
    "All ten setters must end with: return $this; Found " + chainCount + " of 10."
  ));

  const buildOk =
    has(answer, "function\\s+build\\s*\\(\\s*\\)\\s*:\\s*SubjectOffering") &&
    has(answer, "return\\s+\\$this->offering\\s*;?");
  tests.push(t(
    "build() returns the completed SubjectOffering",
    buildOk,
    "Write: public function build(): SubjectOffering { return $this->offering; }"
  ));

  tests.push(t(
    "Builder is instantiated for testing",
    has(answer, "new\\s+SubjectOfferingBuilder\\s*\\(\\s*\\)"),
    "Create the builder with: new SubjectOfferingBuilder()"
  ));

  usage.forEach(function (item) {
    const re = new RegExp("->" + item.fn + "\\s*\\(\\s*" + item.value + "\\s*\\)");
    tests.push(t(
      "->" + item.fn + "() is called with the given value",
      wsTest(answer, re),
      "Chain: ->" + item.fn + "(" + item.value + ")"
    ));
  });

  tests.push(t(
    "->build() finishes the chain",
    has(answer, "->build\\s*\\(\\s*\\)\\s*;"),
    "End the chain with: ->build();"
  ));
  tests.push(t(
    "display() is called on the result",
    has(answer, "->display\\s*\\(\\s*\\)\\s*;"),
    "Call: $offering->display();"
  ));

  return tests;
}

function validatePrototype(answer, full) {
  const tests = [];
  const cloneUsed = wsTest(answer, /clone\s+\$sectionA/);
  const sectionBRefs = (normWs(answer).match(/\$sectionB->/g) || []).length;
  tests.push(t(
    "SubjectOfferingPrototype exists",
    has(full, "class\\s+SubjectOfferingPrototype"),
    "Expected: class SubjectOfferingPrototype"
  ));
  tests.push(t(
    "Constructor works",
    has(full, "function\\s+__construct\\s*\\(") && has(full, "public\\s+string\\s+\\$academicYear"),
    "Expected: a working constructor that stores every property"
  ));
  tests.push(t(
    "clone is used",
    cloneUsed,
    "Assign the copy with: $sectionB = clone $sectionA;"
  ));
  tests.push(t(
    "Clone is a separate object",
    cloneUsed && !wsTest(answer, /sectionA\s+=\s+[^\s]/),
    "Use clone $sectionA and never re-assign $sectionA itself."
  ));
  tests.push(t(
    "Original offering stays untouched",
    !wsTest(answer, /\$sectionA->\s*\w+\s*=/) && has(full, "\"BSIT-2A\"") && has(full, "\"Room 301\""),
    "Only modify $sectionB. $sectionA must keep BSIT-2A, MWF 8:00 AM - 9:00 AM, Room 301, and Juan Dela Cruz."
  ));
  tests.push(t(
    "Clone contains copied information",
    cloneUsed && sectionBRefs >= 4,
    "The clone should still reference the copied offering properties through $sectionB."
  ));
  tests.push(t(
    "Clone section becomes BSIT-2B",
    wsTest(answer, /\$sectionB->section\s*=\s*"BSIT-2B"\s*;/),
    "Write: $sectionB->section = \"BSIT-2B\";"
  ));
  tests.push(t(
    "Clone schedule is changed to TTh 10:00 AM - 11:30 AM",
    wsTest(answer, /\$sectionB->schedule\s*=\s*"TTh 10:00 AM - 11:30 AM"\s*;/),
    "Write: $sectionB->schedule = \"TTh 10:00 AM - 11:30 AM\";"
  ));
  tests.push(t(
    "Clone room is changed to Room 302",
    wsTest(answer, /\$sectionB->room\s*=\s*"Room 302"\s*;/),
    "Write: $sectionB->room = \"Room 302\";"
  ));
  tests.push(t(
    "Clone faculty is changed to the subject instructor",
    wsTest(answer, /\$sectionB->faculty\s*=\s*"Rich Anjo Capiloyan"\s*;/),
    "In $sectionB->faculty, use the exact faculty name of this subject's instructor (the laboratory developer)."
  ));
  return tests;
}

/* ------------------------------------------------------------------------ */
/* Score, progress, breakdown                                               */
/* ------------------------------------------------------------------------ */

function recomputeScore() {
  let total = 0;
  ACTIVITIES.forEach(function (a) {
    if (state.activities[a.id].completed) total += a.points;
  });
  state.score = total;
}

function updateScore() {
  const el = document.getElementById("scoreValue");
  if (el) el.textContent = state.score + " / " + state.maxScore;
  const startEl = document.getElementById("startScoreValue");
  if (startEl) startEl.textContent = state.score + " / " + state.maxScore;
}

function updateProgress() {
  const pct = Math.round((state.score / state.maxScore) * 100);
  const fill = document.getElementById("progressFill");
  const label = document.getElementById("progressLabel");
  if (fill) fill.style.width = pct + "%";
  if (label) label.textContent = pct + "%";
}

function unlockedIndex() {
  for (let i = 0; i < ACTIVITIES.length; i++) {
    if (!state.activities[ACTIVITIES[i].id].completed) return i;
  }
  return ACTIVITIES.length;
}

function updateScoreBreakdown() {
  const list = document.getElementById("breakdownList");
  if (!list) return;
  let html = "";
  const maxOpen = unlockedIndex();
  ACTIVITIES.forEach(function (a, i) {
    const rec = state.activities[a.id];
    const done = rec.completed;
    const current = state.started && i === state.currentActivity && !done;
    const locked = state.started && i > maxOpen;
    const icon = done ? "✓" : current ? "●" : locked ? "🔒" : "○";
    const pts = done ? a.points + " / " + a.points : "0 / " + a.points;
    html += '<li class="' + (done ? "done" : "") + '">' +
      '<span class="bd-icon">' + icon + "</span>" +
      '<span class="bd-name">' + a.pattern + "</span>" +
      '<span class="bd-pts">' + pts + "</span></li>";
  });
  html += '<li class="total">' +
    '<span class="bd-icon"></span>' +
    '<span class="bd-name">TOTAL</span>' +
    '<span class="bd-pts">' + state.score + " / " + state.maxScore + "</span></li>";
  list.innerHTML = html;
}

/* ------------------------------------------------------------------------ */
/* Navigation                                                               */
/* ------------------------------------------------------------------------ */

function renderNav() {
  const nav = document.getElementById("patternNav");
  if (!nav) return;
  nav.innerHTML = "";
  const maxOpen = unlockedIndex();
  ACTIVITIES.forEach(function (a, i) {
    const completed = state.activities[a.id].completed;
    const isCurrent = i === state.currentActivity;
    const unlocked = i <= maxOpen;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-btn" + (completed ? " is-done" : "") + (isCurrent ? " is-current" : "") + (!unlocked ? " is-locked" : "");
    btn.disabled = !unlocked;
    if (isCurrent) btn.setAttribute("aria-current", "true");
    const icon = completed ? "✓" : isCurrent ? "●" : "🔒";
    btn.innerHTML =
      '<span class="nav-icon" aria-hidden="true">' + icon + "</span>" +
      '<span class="nav-txt"><b>0' + a.number + " " + a.pattern + "</b>" +
      "<small>" + a.title + "</small></span>";
    btn.setAttribute("aria-label", (completed ? "Completed: " : unlocked ? "Open: " : "Locked: ") + a.pattern);
    if (!unlocked) btn.title = "Locked \u2014 complete Activity " + a.number + " to unlock.";
    btn.addEventListener("click", () => {
      if (!unlocked) return;
      if (state.completed) {
        document.getElementById("completionPanel").classList.add("hidden");
        document.getElementById("activityPanel").classList.remove("hidden");
      }
      state.currentActivity = i;
      saveSession();
      loadActivity(i);
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    nav.appendChild(btn);
  });
}

function renderAll() {
  updateTimer();
  updateScore();
  updateProgress();
  updateScoreBreakdown();
  renderNav();
  renderStudentBar();
}

/* ------------------------------------------------------------------------ */
/* Activity rendering                                                       */
/* ------------------------------------------------------------------------ */

function loadActivity(idx) {
  const panel = document.getElementById("activityPanel");
  const a = ACTIVITIES[idx];
  if (!a) return;
  panel.classList.remove("hidden");
  document.getElementById("completionPanel").classList.add("hidden");

  const taskHtml = TASK_STEPS.map(function (s, i) {
    return "<li><strong>" + (i + 1) + ".</strong> " + s + "</li>";
  }).join("");

  const answerNote = a.answerNote || (a.answerInit.indexOf("____") !== -1
    ? "Complete the PHP code below. Replace each ____ (blank) with the correct expression or statement, including the closing semicolon."
    : "Complete the PHP code below. Add the required PHP declarations shown in the task above.");

  const usageHtml = a.systemUsage.map(function (s) {
    return "<li>" + s + "</li>";
  }).join("");

  const editorClass = a.editorTall ? "editor editor--tall" : "editor";

  panel.innerHTML =
    '<article class="activity">' +
      '<header class="activity-head">' +
        '<div>' +
          '<p class="eyebrow">ACTIVITY ' + a.number + " OF 5</p>" +
          "<h2>Activity " + a.number + " \u2014 " + a.pattern + "</h2>" +
          '<p class="activity-sub">' + a.title + "</p>" +
        "</div>" +
        '<div class="activity-meta">' +
          '<span class="chip chip-pattern">' + a.pattern + "</span>" +
          '<span class="chip chip-points">' + a.points + " POINTS</span>" +
        "</div>" +
      "</header>" +

      '<section class="card info-card">' +
        "<h3 class=\"card-title\">Scenario</h3>" +
        "<p>" + a.scenario + "</p>" +
        "<h3 class=\"card-title\">System Context</h3>" +
        '<ul class="concept-list">' + usageHtml + "</ul>" +
      "</section>" +

      '<section class="card info-card">' +
        "<h3 class=\"card-title\">Learning Objective</h3>" +
        "<p>" + a.objective + "</p>" +
      "</section>" +

      '<section class="card info-card task-card">' +
        "<h3 class=\"card-title\">Your Task</h3>" +
        "<p>Most of the PHP code has already been provided. You do NOT need to write the entire program. Complete only the PHP code shown in the Student Answer section. Use the provided code as your guide.</p>" +
        '<ol class="task-list">' + taskHtml + "</ol>" +
      "</section>" +

      '<section class="card code-card">' +
        '<div class="card-head-row">' +
          "<h3 class=\"card-title\">Provided Code</h3>" +
          '<span class="tag tag-provided">Already completed \u2014 use as your reference</span>' +
        "</div>" +
        "<p class=\"output-note\">" + a.providedNote + "</p>" +
        '<pre class="code-block">' + highlightPhp(a.providedCode) + "</pre>" +
      "</section>" +

      '<section class="answer-block" aria-labelledby="answerTitle">' +
        '<div class="answer-head">' +
          '<h3 id="answerTitle">STUDENT ANSWER</h3>' +
          '<p class="answer-sub">' + answerNote + "</p>" +
        "</div>" +
        '<div class="editor-shell">' +
          '<div class="editor-header">' +
            '<span class="editor-dots" aria-hidden="true"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></span>' +
            '<span class="editor-title">PHP \u2014 Student Answer Code</span>' +
            '<span class="editor-chip">BROWSER VALIDATION MODE</span>' +
          "</div>" +
          '<div class="editor-wrap">' +
            '<div class="line-gutter" id="lineGutter" aria-hidden="true"><pre>1</pre></div>' +
            '<textarea class="' + editorClass + '" id="phpEditor" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" wrap="off" aria-label="Student answer PHP code editor \u2014 Activity ' + a.number + '"></textarea>' +
          "</div>" +
        "</div>" +
        '<div class="actions">' +
          '<button class="btn btn-ghost" id="resetBtn" type="button">Reset Code</button>' +
          '<button class="btn btn-ghost" id="hintBtn" type="button">&#128161; Show Hint</button>' +
          '<button class="btn btn-run" id="runBtn" type="button">&#9654; Run Code</button>' +
        "</div>" +
        '<p class="copy-feedback" id="copyFeedback" role="status"></p>' +
        '<div class="hint-box hidden" id="hintBox">' + a.hint + "</div>" +
      "</section>" +

      '<section class="card result-card" aria-live="polite">' +
        "<h3 class=\"card-title\">Automated Test Results</h3>" +
        '<div class="validating hidden" id="validatingBox"></div>' +
        '<ol class="tests" id="testList"></ol>' +
        '<div class="test-summary hidden" id="testSummary"></div>' +
      "</section>" +

      '<section class="card output-card">' +
        "<h3 class=\"card-title\">Output</h3>" +
        '<p class="output-note" id="outputNote">Click Run Code to validate your implementation. (Browser Validation Mode \u2014 actual execution needs a PHP server.)</p>' +
        '<pre class="code-block output-block hidden" id="outputBlock"></pre>' +
      "</section>" +

      '<section class="result-panel hidden" id="activityResult"></section>' +

      '<div class="next-row hidden" id="nextRow">' +
        '<button class="btn btn-success btn-xl" id="nextBtn" type="button">NEXT PATTERN &rarr;</button>' +
      "</div>" +
    "</article>";

  const editor = document.getElementById("phpEditor");
  editor.value = Object.prototype.hasOwnProperty.call(editorValues, idx)
    ? editorValues[idx]
    : a.answerInit;
  setupEditor(idx);

  document.getElementById("resetBtn").addEventListener("click", function () {
    resetCode(idx);
  });
  document.getElementById("hintBtn").addEventListener("click", showHint);
  document.getElementById("runBtn").addEventListener("click", runValidation);
  document.getElementById("nextBtn").addEventListener("click", nextPattern);

  const completed = state.activities[a.id].completed;
  document.getElementById("nextRow").classList.toggle("hidden", !completed);
  window.setTimeout(function () {
    editor.focus();
  }, 50);
}

function setupEditor(idx) {
  const editor = document.getElementById("phpEditor");
  const gutter = document.getElementById("lineGutter");
  if (!editor || !gutter) return;

  editor.addEventListener("input", function () {
    editorValues[idx] = editor.value;
    rebuildGutter(editor, gutter);
  });
  editor.addEventListener("scroll", function () {
    gutter.scrollTop = editor.scrollTop;
  });
  editor.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.slice(0, start) + "    " + editor.value.slice(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
      editorValues[idx] = editor.value;
      rebuildGutter(editor, gutter);
    }
  });
  rebuildGutter(editor, gutter);
}

function rebuildGutter(editor, gutter) {
  const count = editor.value.split("\n").length;
  let text = "";
  for (let i = 1; i <= count; i++) {
    text += i + "\n";
  }
  gutter.innerHTML = "";
  const pre = document.createElement("pre");
  pre.textContent = text;
  gutter.appendChild(pre);
  gutter.scrollTop = editor.scrollTop;
}

/* ------------------------------------------------------------------------ */
/* Timer                                                                    */
/* ------------------------------------------------------------------------ */

function getElapsedSeconds() {
  if (!state.startTime) return 0;
  return Math.max(0, Math.floor((Date.now() - state.startTime) / 1000));
}

function formatTime(secs) {
  if (!isFinite(secs) || secs < 0) secs = 0;
  secs = Math.floor(secs);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? h + ":" + mm + ":" + ss : mm + ":" + ss;
}

function updateTimer() {
  const el = document.getElementById("timeValue");
  const startEl = document.getElementById("startTimeValue");
  let display = "00:00";
  if (state.completed) {
    if (state.finalTime !== null && state.finalTime !== undefined) {
      display = formatTime(state.finalTime);
    }
  } else if (state.started && state.startTime) {
    display = formatTime(getElapsedSeconds());
  }
  if (el) el.textContent = display;
  if (startEl) startEl.textContent = display;
}

function startTimerLoop() {
  if (timerId === null) {
    timerId = window.setInterval(updateTimer, 1000);
  }
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  updateTimer();
}

/* ------------------------------------------------------------------------ */
/* Session                                                                  */
/* ------------------------------------------------------------------------ */

function saveSession() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Could not save session:", err);
  }
}

function loadSavedSession() {
  let saved = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch (err) {
    saved = null;
  }
  if (!saved || !saved.started) return;
  state.started = saved.started === true;
  state.sessionLocked = saved.sessionLocked === true;
  state.completed = saved.completed === true;
  if (typeof saved.startTime === "number") state.startTime = saved.startTime;
  if (typeof saved.finalTime === "number") state.finalTime = saved.finalTime;
  if (typeof saved.currentActivity === "number") state.currentActivity = saved.currentActivity;
  if (typeof saved.studentId === "string") state.studentId = saved.studentId;
  if (typeof saved.section === "string") state.section = saved.section;
  if (saved.activities) {
    Object.keys(state.activities).forEach(function (key) {
      if (saved.activities[key] && typeof saved.activities[key].completed === "boolean") {
        state.activities[key].completed = saved.activities[key].completed;
      }
    });
  }
  recomputeScore();
}

function beforeUnloadHandler(event) {
  if (state.started && !state.completed) {
    event.preventDefault();
    event.returnValue = "Your laboratory session is still in progress.";
  }
}

/* ------------------------------------------------------------------------ */
/* Actions                                                                  */
/* ------------------------------------------------------------------------ */

function startActivity() {
  if (state.started) return;
  const err = document.getElementById("startModalError");
  if (err) {
    err.textContent = "";
    err.classList.add("hidden");
  }
  openModal("startModal");
  const idInput = document.getElementById("studentIdInput");
  if (idInput) {
    idInput.value = state.studentId || "";
    idInput.focus();
  }
  const secSelect = document.getElementById("sectionSelect");
  if (secSelect) secSelect.value = state.section || "";
}

function confirmStart() {
  if (state.started) return false;
  const err = document.getElementById("startModalError");
  const idInput = document.getElementById("studentIdInput");
  const secSelect = document.getElementById("sectionSelect");
  const fail = function (msg) {
    if (err) {
      err.textContent = msg;
      err.classList.remove("hidden");
    }
    return false;
  };
  const idNumber = (idInput ? idInput.value : "").trim();
  const section = secSelect ? secSelect.value : "";
  if (!idNumber) return fail("Please enter your Student ID Number.");
  if (!section) return fail("Please select your Section.");
  state.studentId = idNumber;
  state.section = section;
  closeModal("startModal");
  beginSession();
  return true;
}

function beginSession() {
  if (state.started) return;
  state.started = true;
  state.sessionLocked = true;
  state.startTime = Date.now();
  state.currentActivity = 0;
  saveSession();

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("sessionBadge").classList.remove("hidden");
  renderStudentBar();
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("breakdownCard").classList.remove("hidden");
  document.getElementById("patternNavSection").classList.remove("hidden");

  loadActivity(0);
  renderAll();
  startTimerLoop();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextPattern() {
  const next = unlockedIndex();
  if (next >= ACTIVITIES.length) {
    showCompletion();
  } else {
    state.currentActivity = next;
    saveSession();
    loadActivity(next);
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function runValidation() {
  const runBtn = document.getElementById("runBtn");
  const editor = document.getElementById("phpEditor");
  if (!state.started) {
    const note = document.getElementById("outputNote");
    if (note) note.textContent = "Press START ACTIVITY to begin the laboratory before running code.";
    const block = document.getElementById("outputBlock");
    if (block) block.classList.add("hidden");
    return;
  }
  if (!editor || validating) return;
  const a = ACTIVITIES[state.currentActivity];
  const code = editor.value;
  const full = a.providedCode + "\n" + code;
  const results = a.validate(code, full);

  document.getElementById("testList").innerHTML = "";
  document.getElementById("testSummary").classList.add("hidden");
  document.getElementById("activityResult").classList.add("hidden");
  if (runBtn) runBtn.disabled = true;

  validating = true;
  const box = document.getElementById("validatingBox");
  box.innerHTML = "";
  box.classList.remove("hidden");
  const title = document.createElement("div");
  title.className = "val-title";
  title.textContent = "VALIDATING PHP CODE...";
  box.appendChild(title);
  const steps = [
    "Checking class structure",
    "Checking required methods",
    "Checking implementation",
    "Running pattern tests"
  ];
  steps.forEach(function (step, idx) {
    window.setTimeout(function () {
      const row = document.createElement("div");
      row.className = "val-step";
      row.textContent = "✓ " + step;
      box.appendChild(row);
      if (idx === steps.length - 1) {
        window.setTimeout(function () {
          box.classList.add("hidden");
          validating = false;
          if (runBtn) runBtn.disabled = false;
          finalizeValidation(a, results, code);
        }, 360);
      }
    }, idx * 300);
  });
}

function finalizeValidation(a, results, code) {
  const passed = results.every(function (r) {
    return r.pass;
  });
  renderTests(results);
  renderOutputPanel(a, results, passed);

  if (passed) {
    const wasCompleted = state.activities[a.id].completed;
    const awarded = awardPoints();
    renderResult(a, passed, awarded && !wasCompleted);
    if (a.id === "prototype") {
      showCompletion();
      return;
    }
  } else {
    renderResult(a, passed, false);
  }
}

function renderTests(results) {
  const list = document.getElementById("testList");
  const summary = document.getElementById("testSummary");
  list.innerHTML = "";
  let passCount = 0;
  results.forEach(function (r, i) {
    if (r.pass) passCount++;
    const li = document.createElement("li");
    li.className = "test " + (r.pass ? "pass" : "fail");
    const detail = r.detail
      ? '<p class="test-detail">' + escapeHtml(r.detail) + "</p>"
      : "";
    li.innerHTML =
      '<span class="test-icon" aria-hidden="true">' + (r.pass ? "✓" : "✗") + "</span>" +
      "<div><span class=\"test-name\">Test " + (i + 1) + " \u2014 " + escapeHtml(r.name) + "</span>" + detail + "</div>";
    list.appendChild(li);
  });
  summary.classList.remove("hidden");
  summary.className = "test-summary " + (passCount === results.length ? "pass" : "fail");
  summary.textContent = passCount + " / " + results.length + " TESTS PASSED";
}

function renderOutputPanel(a, results, passed) {
  const note = document.getElementById("outputNote");
  const block = document.getElementById("outputBlock");
  const failCount = results.filter(function (r) {
    return !r.pass;
  }).length;
  if (passed) {
    note.textContent = "All checks passed. Expected output that a PHP server (XAMPP, WAMP, Laragon, or the PHP built-in server) would produce for this pattern:";
  } else {
    note.textContent = failCount + " test(s) failed \u2014 review the failed items and fix your code. The expected output your code should produce is shown below for reference:";
  }
  block.classList.remove("hidden");
  block.textContent = a.expectedOutput;
}

function renderResult(a, passed, newlyAwarded) {
  const panel = document.getElementById("activityResult");
  const row = document.getElementById("nextRow");
  panel.classList.remove("hidden");
  if (passed) {
    const awardText = newlyAwarded
      ? "+" + a.points + " POINTS"
      : "Points were already awarded \u2014 no duplicate credit.";
    panel.innerHTML =
      '<div class="result-banner pass">' +
        '<span class="result-icon" aria-hidden="true">&#127881;</span>' +
        "<div>" +
          "<h3>ACTIVITY PASSED</h3>" +
          "<p>" + awardText + "</p>" +
          '<p class="result-score">Score: ' + state.score + " / " + state.maxScore + "</p>" +
        "</div>" +
      "</div>";
    row.classList.remove("hidden");
  } else {
    panel.innerHTML =
      '<div class="result-banner fail">' +
        '<span class="result-icon" aria-hidden="true">&#9888;&#65039;</span>' +
        "<div>" +
          "<h3>ACTIVITY NOT PASSED</h3>" +
          "<p>0 / " + a.points + " POINTS</p>" +
          '<p class="result-score">Fix the failed tests, then click Run Code again.</p>' +
        "</div>" +
      "</div>";
    row.classList.add("hidden");
  }
  panel.querySelector(".result-banner").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function awardPoints() {
  const a = ACTIVITIES[state.currentActivity];
  const rec = state.activities[a.id];
  if (!rec.completed) {
    rec.completed = true;
    recomputeScore();
    updateScore();
    updateProgress();
    updateScoreBreakdown();
    renderNav();
    saveSession();
    return true;
  }
  return false;
}

function resetCode(idx) {
  const editor = document.getElementById("phpEditor");
  if (!editor) return;
  const a = ACTIVITIES[idx];
  const ok = window.confirm(
    "Reset the current Student Answer to its original incomplete code? Your score, timer, progress, and completed patterns will NOT change."
  );
  if (!ok) return;
  editor.value = a.answerInit;
  editorValues[idx] = a.answerInit;
  const gutter = document.getElementById("lineGutter");
  if (gutter) rebuildGutter(editor, gutter);
  const fb = document.getElementById("copyFeedback");
  if (fb) {
    fb.textContent = "✓ Code reset to original";
    fb.classList.add("show");
    window.setTimeout(function () {
      fb.classList.remove("show");
    }, 2000);
  }
}

function showHint() {
  const box = document.getElementById("hintBox");
  const btn = document.getElementById("hintBtn");
  if (!box) return;
  const hidden = box.classList.toggle("hidden");
  if (btn) btn.textContent = hidden ? "💡 Show Hint" : "💡 Hide Hint";
}

function resetLaboratory() {
  if (!state.started) return;
  openResetModal();
}

function openResetModal() {
  const err = document.getElementById("resetModalError");
  if (err) {
    err.textContent = "";
    err.classList.add("hidden");
  }
  const input = document.getElementById("resetCodeInput");
  if (input) {
    input.value = "";
    input.focus();
  }
  openModal("resetModal");
}

function closeResetModal() {
  closeModal("resetModal");
}

function handleResetCode() {
  const input = document.getElementById("resetCodeInput");
  const code = input ? input.value.trim() : "";
  const err = document.getElementById("resetModalError");
  if (code !== RESET_CODE) {
    if (err) {
      err.textContent = "Incorrect code. Reset canceled.";
      err.classList.remove("hidden");
    }
    if (input) input.select();
    closeResetModal();
    const tryAgain = window.confirm ? window.confirm("Incorrect reset code. Try again?") : false;
    if (tryAgain) openResetModal();
    return;
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (errIgnore) {
    console.warn(errIgnore);
  }
  closeResetModal();
  try {
    window.location.reload();
  } catch (errIgnore) {
    console.warn("Reload not available; session storage was cleared.", errIgnore);
  }
}

/* ------------------------------------------------------------------------ */
/* Modals, student bar, and results                                          */
/* ------------------------------------------------------------------------ */

function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("hidden");
    el.setAttribute("aria-hidden", "false");
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add("hidden");
    el.setAttribute("aria-hidden", "true");
  }
}

function renderStudentBar() {
  const bar = document.getElementById("studentBar");
  if (bar) bar.classList.toggle("hidden", !state.started);
  const idEl = document.getElementById("studentIdValue");
  if (idEl) idEl.textContent = state.studentId || "\u2014";
  const secEl = document.getElementById("studentSectionValue");
  if (secEl) secEl.textContent = state.section || "\u2014";
}

function patternsCompletedCount() {
  return ACTIVITIES.filter(function (a) {
    return state.activities[a.id].completed;
  }).length;
}

function progressPercent() {
  return Math.round((state.score / state.maxScore) * 100);
}

function populateResults() {
  const done = patternsCompletedCount();
  const set = function (id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set("rsStudentId", state.studentId || "\u2014");
  set("rsSection", state.section || "\u2014");
  set("rsScore", state.score + " / " + state.maxScore);
  set("rsCompleted", done + " / " + ACTIVITIES.length);
  set("rsProgress", progressPercent() + "%");
  set(
    "rsTime",
    formatTime(state.completed ? state.finalTime || 0 : getElapsedSeconds())
  );
  set("rsStamp", formatDateStamp());
}

function openResults() {
  populateResults();
  openModal("resultsModal");
}

function closeResults() {
  closeModal("resultsModal");
}

function formatDateStamp() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const h24 = d.getHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");
  const ampm = h24 < 12 ? "AM" : "PM";
  return mm + "/" + dd + "/" + d.getFullYear() + " " + h12 + ":" + min + ":" + sec + " " + ampm;
}

function downloadResultImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 820;
  canvas.height = 560;
  const ctx = canvas.getContext ? canvas.getContext("2d") : null;
  if (!ctx) {
    if (window.alert) window.alert("Photo download is not supported in this browser.");
    return;
  }

  const done = patternsCompletedCount();
  const time = formatTime(state.completed ? state.finalTime || 0 : getElapsedSeconds());
  const rows = [
    { label: "STUDENT ID", value: state.studentId || "\u2014" },
    { label: "SECTION", value: state.section || "\u2014" },
    { label: "CURRENT SCORE", value: state.score + " / " + state.maxScore },
    { label: "PATTERNS COMPLETED", value: done + " / " + ACTIVITIES.length },
    { label: "PROGRESS", value: progressPercent() + "%" },
    { label: "COMPLETION TIME", value: time },
    { label: "DATE & TIME", value: formatDateStamp() }
  ];

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#312e81");
  grad.addColorStop(0.55, "#4f46e5");
  grad.addColorStop(1, "#0ea5e9");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 18);
  } else {
    ctx.rect(40, 40, canvas.width - 80, canvas.height - 80);
  }
  ctx.fill();

  ctx.fillStyle = "#4f46e5";
  ctx.font = "700 14px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("ITPE 130", 70, 96);
  ctx.fillText("\u2502", 158, 96);

  ctx.fillStyle = "#0f172a";
  ctx.font = "800 26px system-ui, sans-serif";
  ctx.fillText("INTEGRATIVE PROGRAMMING 2", 182, 96);

  ctx.fillStyle = "#0f172a";
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.fillText("Creational Design Pattern Laboratory", 70, 128);
  ctx.fillStyle = "#64748b";
  ctx.font = "400 14px system-ui, sans-serif";
  ctx.fillText("Subject Offering & Student Enrollment System", 70, 152);

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, 172);
  ctx.lineTo(canvas.width - 70, 172);
  ctx.stroke();

  rows.forEach(function (row, i) {
    const y = 218 + i * 42;
    ctx.fillStyle = "#64748b";
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.fillText(row.label, 70, y);
    ctx.fillStyle = "#0f172a";
    ctx.font = "800 17px 'ui-monospace', monospace";
    ctx.fillText(row.value, 300, y);
    ctx.strokeStyle = "#f1f5f9";
    ctx.beginPath();
    ctx.moveTo(70, y + 12);
    ctx.lineTo(canvas.width - 70, y + 12);
    ctx.stroke();
  });

  ctx.fillStyle = "#64748b";
  ctx.font = "400 12.5px system-ui, sans-serif";
  ctx.fillText("Developed by Rich Anjo Capiloyan  |  DOrSU BSIT Faculty / Computer Programmer - DICT", 70, canvas.height - 66);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 11px system-ui, sans-serif";
  ctx.fillText("BROWSER VALIDATION MODE - PHP Structure Verification", 70, canvas.height - 46);

  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "ITPE130_Creational_Patterns_Result.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (window.alert) window.alert("Result photo downloaded.");
}

/* ------------------------------------------------------------------------ */
/* Completion                                                               */
/* ------------------------------------------------------------------------ */

function showCompletion() {
  if (!state.completed) {
    state.completed = true;
    if (state.finalTime === null || state.finalTime === undefined) {
      state.finalTime = getElapsedSeconds();
    }
    saveSession();
  }
  stopTimer();

  const panel = document.getElementById("completionPanel");
  const activityPanel = document.getElementById("activityPanel");
  activityPanel.classList.add("hidden");
  panel.classList.remove("hidden");

  const time = formatTime(state.finalTime || 0);
  let rows = "";
  ACTIVITIES.forEach(function (a) {
    const rec = state.activities[a.id];
    const pts = rec.completed ? a.points + " / " + a.points : "0 / " + a.points;
    rows += "<li><b>✓ " + a.pattern + "</b><span>" + pts + "</span></li>";
  });

  panel.innerHTML =
    '<div class="completion">' +
      '<p class="eyebrow">ALL FIVE PATTERNS COMPLETED</p>' +
      "<h2>&#127881; Laboratory Completed!</h2>" +
      '<p class="completion-sub">You completed the Creational Design Patterns laboratory for the Subject Offering &amp; Student Enrollment System.</p>' +
      '<p class="completion-note">All five activities have been completed. The timer remains stopped.</p>' +
      '<div class="completion-cards">' +
        '<div class="completion-card">' +
          "<span>FINAL SCORE</span>" +
          "<strong>" + state.score + " / " + state.maxScore + "</strong>" +
        "</div>" +
        '<div class="completion-card">' +
          "<span>COMPLETION TIME</span>" +
          "<strong>" + time + "</strong>" +
        "</div>" +
      "</div>" +
      '<div class="final-results">' +
        "<h3>Final Results</h3>" +
        "<ul>" + rows + "</ul>" +
      "</div>" +
      '<div class="final-total">' +
        "<div><b>FINAL SCORE</b><span>" + state.score + " / " + state.maxScore + "</span></div>" +
        "<div><b>COMPLETION TIME</b><span>" + time + "</span></div>" +
      "</div>" +
    "</div>";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ------------------------------------------------------------------------ */
/* Init                                                                     */
/* ------------------------------------------------------------------------ */

function isProtectedCodeZone(el) {
  let node = el;
  while (node && node.classList && typeof node.classList === "object") {
    if (
      node.classList.contains("code-block") ||
      node.classList.contains("editor") ||
      node.classList.contains("line-gutter")
    ) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function initCopyProtection() {
  function blockCopy(evt) {
    if (isProtectedCodeZone(evt.target)) evt.preventDefault();
  }

  document.addEventListener("copy", blockCopy, true);
  document.addEventListener("cut", blockCopy, true);
  document.addEventListener("dragstart", blockCopy, true);
  document.addEventListener("contextmenu", blockCopy, true);

  document.addEventListener("keydown", function (evt) {
    if (!isProtectedCodeZone(evt.target)) return;
    const mod = evt.ctrlKey || evt.metaKey;
    const key = String(evt.key || "").toLowerCase();
    const isCopyShortcut = mod && key === "c";
    const isCutShortcut = mod && key === "x";
    const isLegacyCopy = mod && String(evt.key || "") === "Insert";
    if (isCopyShortcut || isCutShortcut || isLegacyCopy) {
      evt.preventDefault();
    }
  });
}

function wire(id, type, cb) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(type, cb);
}

function initializeApp() {
  loadSavedSession();

  initCopyProtection();
  wire("startBtn", "click", startActivity);
  wire("resetLabBtn", "click", resetLaboratory);
  wire("topResetBtn", "click", openResetModal);
  wire("resultsBtn", "click", openResults);
  wire("downloadBtn", "click", downloadResultImage);
  wire("startModalClose", "click", function () { closeModal("startModal"); });
  wire("startCancelBtn", "click", function () { closeModal("startModal"); });
  wire("resultsModalClose", "click", closeResults);
  wire("resultsCloseBtn", "click", closeResults);
  wire("resetModalClose", "click", closeResetModal);
  wire("resetCancelBtn", "click", closeResetModal);
  wire("resetConfirmBtn", "click", handleResetCode);
  wire("resetCodeInput", "keydown", function (evt) {
    if (evt.key === "Enter") handleResetCode();
  });
  wire("startForm", "submit", function (evt) {
    evt.preventDefault();
    confirmStart();
  });
  wire("startModal", "click", function (evt) {
    if (evt.target && evt.target.id === "startModal") closeModal("startModal");
  });
  wire("resultsModal", "click", function (evt) {
    if (evt.target && evt.target.id === "resultsModal") closeModal("resultsModal");
  });
  wire("resetModal", "click", function (evt) {
    if (evt.target && evt.target.id === "resetModal") closeModal("resetModal");
  });
  window.addEventListener("keydown", function (evt) {
    if (evt.key === "Escape" || evt.key === "Esc") {
      closeModal("startModal");
      closeModal("resultsModal");
      closeModal("resetModal");
    }
  });
  window.addEventListener("beforeunload", beforeUnloadHandler);

  if (state.started) {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("sessionBadge").classList.remove("hidden");
    renderStudentBar();
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("breakdownCard").classList.remove("hidden");
    document.getElementById("patternNavSection").classList.remove("hidden");
    renderAll();

    if (state.completed) {
      showCompletion();
    } else {
      const max = unlockedIndex();
      let target = state.currentActivity;
      if (!(target >= 0 && target < ACTIVITIES.length)) target = 0;
      if (target > max) target = max;
      state.currentActivity = target;
      loadActivity(target);
      startTimerLoop();
    }
    saveSession();
  } else {
    updateTimer();
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);