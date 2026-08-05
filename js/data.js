/* =========================================================================
   EE II Prep Trainer — content data
   Tailored to the LivaNova "Electrical Engineer II" (RF & Electrical
   Engineering, Neuromodulation) job description.
   ========================================================================= */

const ROLE_INFO = {
  title: "Electrical Engineer II",
  company: "LivaNova",
  department: "Electrical Engineering — RF & Electrical Engineering, Neuromodulation",
  reportsTo: "Sr. Manager, RF & Electrical Engineering, Neuromodulation",
  purpose:
    "A hands-on role embedded with a cross-functional group of electrical, RF, and firmware engineers, " +
    "building test systems across the product lifecycle — from characterization through production and " +
    "post-production — for implantable/wearable Neuromodulation medical devices.",
  responsibilities: [
    "Determine feasibility of a design concept via part selection, prototyping, initial PCBA fabrication, board bring-up/debug, and characterization.",
    "Develop automated test systems for Continuous test, Characterization, Design Verification, and Production.",
    "Execute tests, analyze data with statistical methods, and influence design choices with findings.",
    "Write technical specifications and requirements; communicate clearly in writing and verbally.",
    "Automate characterization, design verification, and production-level tests in C# (and other tools).",
    "Perform risk assessment and mitigation via design/process controls; run dFMEA independently.",
    "Run periodic design reviews to inform stakeholders and gather critical feedback.",
    "Collaborate cross-functionally to plan/execute projects — scope, requirements, timelines, budgets.",
    "Design next-gen test automation architecture, emphasizing reusable toolsets/assets.",
    "Automate validation of test software itself: scheduled builds, static test, unit/integration tests, simulators mimicking hardware.",
    "Define milestones/deliverables, track progress, manage risk with contingency plans.",
    "Communicate project status via regular design reviews.",
    "Mentor/coach interns.",
    "Manage a Kanban board, run agile ceremonies (stand-ups), assign priorities.",
  ],
  qualifications: [
    "BS in Electrical Engineering, Computer Engineering, or equivalent experience",
    "3+ years electrical design experience: circuit design, system bring-up, integration, debug",
    "Regulated industry (medical device) experience preferred",
    "Low-power circuit design experience",
    "Embedded devices experience",
    "Cadence Suite for simulation",
    "Altium for board layout and schematic capture",
    "Hands-on debug equipment: oscilloscope, multimeter, logic analyzer",
    "2+ years C, C++, or C# for electrical test automation",
  ],
};

/* Each module: id, title, jdRef, summary, concepts[], flashcards[{f,b}],
   quiz[{q, options[4], correct, explain}], practice (hands-on suggestion) */
const MODULES = [
  {
    id: "bringup",
    title: "PCBA Design & Board Bring-Up",
    jdRef: "Feasibility, part selection, prototyping, board bring-up & debug, characterization",
    summary:
      "The front end of the product lifecycle: turning a concept into a working prototype board, " +
      "then proving it actually does what the schematic says it should.",
    concepts: [
      "Feasibility starts with a block diagram and rough part selection before any layout — the goal is to de-risk the concept, not build the final product.",
      "Part selection balances electrical specs, package/footprint, cost, lead time, and lifecycle status — plus, for medical devices, traceability and quality grade.",
      "Bring-up follows a strict order: visual/continuity inspection → current-limited power-up → verify rail voltages/sequencing → verify clocks/resets → verify comms buses → verify functional blocks.",
      "Debug is divide-and-conquer: isolate the failing subsystem, compare measured vs. simulated/expected values, use test points and a 'golden board' reference when available.",
      "Characterization sweeps corners (temperature, voltage, load) to quantify margin against spec and produce data supporting a design decision.",
    ],
    flashcards: [
      { f: "What is the correct order of operations for board bring-up?", b: "Visual/continuity check → current-limited power-up → verify rails → verify clocks/resets → verify comms → verify functional blocks." },
      { f: "What's a 'golden board' and why use one?", b: "A known-good reference unit used to quickly localize faults by comparing measurements against it." },
      { f: "EVT / DVT / PVT — what do they stand for?", b: "Engineering Validation Test → Design Validation Test → Production Validation Test." },
      { f: "Why current-limit the bench supply on first power-up of a new board?", b: "Protects the board from cascading damage if there's a short, and lets you watch inrush/steady current before full power." },
    ],
    quiz: [
      { q: "You just received first-article PCBAs. What should you do BEFORE applying power?", options: ["Power up at full voltage immediately to save time", "Visually inspect for solder defects and check resistance across power rails to ground", "Flash firmware first", "Run the full characterization sweep first"], correct: 1, explain: "Inspecting for shorts/opens before power prevents damage and catches manufacturing defects early." },
      { q: "A bring-up board's 3.3V rail is present but the MCU never boots. Most efficient next step?", options: ["Replace the MCU immediately", "Check reset and clock signals with a scope before condemning the part", "Re-flow the whole board", "Order new PCBAs"], correct: 1, explain: "Divide-and-conquer: verify reset/clock delivery before assuming the part itself is bad." },
      { q: "What is the purpose of design characterization testing?", options: ["Finding the cheapest components", "Quantifying performance margin across environmental/operating corners vs. spec", "Writing firmware", "Creating the BOM"], correct: 1, explain: "Characterization tells you how much margin you actually have, not just pass/fail." },
      { q: "Which best describes DVT (Design Validation Test)?", options: ["The first power-on smoke test", "Verifying the design meets its full specification/performance under intended conditions", "A manufacturing pilot run", "A marketing demo"], correct: 1, explain: "DVT confirms the locked design meets spec, distinct from early EVT bring-up." },
      { q: "Why is 'second source' availability a part-selection criterion in medical device design?", options: ["It isn't important", "It mitigates supply-chain/obsolescence risk that could halt production", "It lowers component performance", "It only matters for firmware"], correct: 1, explain: "Single-sourced parts are a known production/business risk, especially over a medical device's long lifecycle." },
    ],
    practice: "Pick a simple open-source dev board schematic and write out your own bring-up checklist in the order you'd power it up and verify it, before looking at how the vendor did it.",
  },
  {
    id: "cadence",
    title: "Cadence Suite (Simulation)",
    jdRef: "Experience with Cadence Suite for simulation",
    summary:
      "Simulating circuit behavior before committing to layout — the highest-leverage gap to close since " +
      "this is an explicit, named qualification.",
    concepts: [
      "Cadence tools (e.g., PSpice/Virtuoso-class flows) simulate circuit behavior before layout — validating topology, component values, and tolerances.",
      "Common analyses: DC operating point, AC/frequency response, transient (time-domain), and Monte Carlo/worst-case for tolerance stack-up.",
      "SPICE models come from manufacturer libraries; simulation accuracy depends on model fidelity — always sanity-check against datasheet curves.",
      "Simulation earns its keep on critical/tricky circuits: power supply loop stability, filter response, analog front-end gain/noise, timing margins — not every trivial net.",
      "Iterative flow: schematic capture → simulate → tune values/topology → re-simulate → lock down before layout.",
    ],
    flashcards: [
      { f: "What is transient analysis used for?", b: "Time-domain behavior — startup, switching, step response." },
      { f: "What is Monte Carlo analysis for?", b: "Statistically modeling component tolerance variation to predict yield/robustness." },
      { f: "Why sanity-check SPICE models against the datasheet?", b: "Vendor models can be idealized or wrong; datasheet curves are ground truth." },
      { f: "What analysis checks power-supply loop stability?", b: "AC/loop-gain analysis, looking at phase and gain margin." },
    ],
    quiz: [
      { q: "You're designing a low-power implant's regulator loop. Which analysis best predicts stability?", options: ["Transient only", "AC/loop-gain analysis for phase/gain margin", "DC operating point only", "Layout DRC"], correct: 1, explain: "Loop stability is an AC/frequency-domain question, characterized by phase and gain margin." },
      { q: "Monte Carlo simulation is most useful for:", options: ["Checking silkscreen text", "Predicting how component tolerances affect performance across many random samples", "Routing traces", "Generating a BOM"], correct: 1, explain: "Monte Carlo randomizes tolerances across many runs to predict real-world spread/yield." },
      { q: "Before trusting a simulated result for a critical filter, you should:", options: ["Assume it's correct because it's from Cadence", "Compare the simulated component models/behavior against datasheet curves", "Skip layout entirely", "Ignore tolerances"], correct: 1, explain: "Simulation is only as good as its models — always sanity check." },
      { q: "What's the primary value of simulating before layout?", options: ["It fully replaces prototypes", "It catches topology/value errors and quantifies margin cheaply before committing to an expensive board spin", "It generates firmware automatically", "It's an ISO 14971 requirement"], correct: 1, explain: "Simulation is cheap; board spins are not — catch errors early." },
      { q: "For a switching regulator, which analysis reveals startup inrush and output ripple?", options: ["AC analysis", "Transient (time-domain) analysis", "Monte Carlo", "DRC"], correct: 1, explain: "Inrush and ripple are time-domain waveform behaviors, seen in transient sims." },
    ],
    practice: "Install a free SPICE tool (e.g., LTspice) and simulate a simple LDO or buck regulator: run a transient sim for startup/ripple and an AC sim for loop stability. This maps directly to Cadence's analysis types and gives you a concrete story for interviews.",
  },
  {
    id: "altium",
    title: "Altium Designer (Schematic & PCB Layout)",
    jdRef: "Experience with Altium board layout and schematic capture",
    status: "strength",
    summary:
      "You already have real Altium experience from boards you've designed for the EE R&D team — this named " +
      "qualification is effectively satisfied. Treat this module as polish, not a gap: sharpen the *why* behind " +
      "layout rules so you can defend your design decisions fluently in an interview, and prep 2-3 of your own " +
      "boards as concrete talking points (what you laid out, tradeoffs you made, problems you caught).",
    concepts: [
      "Schematic capture defines nets/connectivity and drives layout — clean hierarchical sheets and consistent naming make review and debug easier.",
      "Library discipline matters: accurate footprints, 3D models, and verified pin mapping prevent costly fab/assembly errors.",
      "Layout considerations: stack-up planning, unbroken return-path continuity, controlled impedance for RF, decoupling placed close to power pins.",
      "DRC (Design Rule Check) and ERC (Electrical Rule Check) catch clearance/connectivity/manufacturability issues before fab.",
      "For RF/analog work (relevant to Neuromodulation telemetry), trace-length matching, shielding/guard traces, and via placement near ground return are critical.",
    ],
    flashcards: [
      { f: "What does ERC check?", b: "Schematic-level electrical rule violations — unconnected pins, conflicting outputs, etc." },
      { f: "What does DRC check?", b: "Physical layout rule violations — clearance, trace width, spacing — before fab." },
      { f: "Why keep decoupling caps close to power pins?", b: "Minimizes loop inductance for effective high-frequency noise suppression." },
      { f: "Why avoid splitting the ground plane under a signal trace?", b: "It breaks the return path, causing EMI and signal-integrity problems." },
    ],
    quiz: [
      { q: "A high-speed trace crosses a split in the ground plane. Primary risk?", options: ["Extra silkscreen clutter", "Broken return path causing EMI/signal-integrity degradation", "Faster routing", "Lower BOM cost"], correct: 1, explain: "Return current wants to flow directly under the signal trace; a split forces a long detour, radiating and coupling noise." },
      { q: "What's the purpose of running DRC before releasing Gerbers?", options: ["Check schematic connectivity only", "Catch physical layout violations that could cause fab/assembly defects", "Generate the BOM", "Simulate circuit behavior"], correct: 1, explain: "DRC is a physical-layout check, distinct from ERC's schematic check." },
      { q: "For an RF telemetry front-end, what layout practice is critical?", options: ["Randomized trace lengths", "Controlled impedance routing with careful ground return/via placement", "Ignoring stack-up", "Wide open ground pours only near connectors"], correct: 1, explain: "RF performance depends on controlled impedance and a clean, continuous return path." },
      { q: "Why maintain an accurate, verified component library?", options: ["Optional for prototypes", "Incorrect footprints/pin mapping cause costly fab or assembly errors discovered late", "Only affects BOM cost", "No effect on manufacturability"], correct: 1, explain: "A wrong footprint isn't caught until parts don't fit — an expensive, late discovery." },
      { q: "What does ERC catch that DRC does not?", options: ["Trace width violations", "Schematic-level issues like unconnected pins or conflicting outputs", "Silkscreen overlap", "Solder mask clearance"], correct: 1, explain: "ERC operates on the schematic/connectivity; DRC operates on the physical board." },
    ],
    practice: "Pick 2-3 boards you've actually designed (you've got RF, logic, automation, and battery-installation boards to draw from — plus the ~1cm x 1cm fix board, which is a standout) and, for each, write a few sentences on: the trickiest layout decision you made (stack-up, return path, decoupling, RF routing), a DRC/ERC catch that mattered, and what you'd do differently now. These become direct interview answers, not hypotheticals.",
  },
  {
    id: "lowpower",
    title: "Low-Power Circuit Design",
    jdRef: "Experience with low-power circuit design",
    summary:
      "Especially relevant for implantable/wearable Neuromodulation devices, where battery life is a core spec, not an afterthought.",
    concepts: [
      "Implantable/wearable devices are battery- or wirelessly-powered — every microamp matters. Design for average current over the full duty cycle, not just worst-case peak.",
      "Techniques: aggressive sleep/standby modes, duty-cycled sensing/telemetry, low-quiescent-current regulators, load switches to fully power down unused blocks.",
      "Choose low-leakage components; minimize always-on analog bias paths; prefer wake-on-event architectures over continuous polling.",
      "Battery/energy budget modeling is quantitative: sum (active current × duty cycle) + sleep current, then derive expected device lifetime from battery capacity.",
      "Power sequencing and brown-out behavior matter more at low power — verify graceful behavior as battery voltage droops near end-of-life.",
    ],
    flashcards: [
      { f: "What is 'quiescent current' and why does it dominate in implants?", b: "Current drawn at idle/no-load; since implants spend most time asleep, quiescent current dominates battery life." },
      { f: "What's a load switch used for?", b: "Fully disconnecting power to an unused block, eliminating leakage rather than just disabling it." },
      { f: "How do you estimate battery life from a power budget?", b: "Sum (active current × duty cycle) + sleep current = average current; battery capacity ÷ average current ≈ lifetime." },
      { f: "Why prefer wake-on-event over continuous polling?", b: "It keeps the system in low-power sleep except when an actual event occurs, drastically cutting average current." },
    ],
    quiz: [
      { q: "A neurostimulator spends 99% of its time in standby. What dominates its battery life?", options: ["Peak stimulation current", "Quiescent/sleep current", "Programming current", "Manufacturing test current"], correct: 1, explain: "With a 99% duty cycle in standby, sleep current is the dominant term in the average-current calculation." },
      { q: "Which technique best reduces leakage from an unused subsystem?", options: ["Lowering its clock frequency", "A load switch that fully disconnects its power rail", "Adding a pull-up resistor", "Increasing decoupling capacitance"], correct: 1, explain: "Disabling a block often still leaves leakage paths; a load switch removes power entirely." },
      { q: "How should you compute expected device lifetime from a power budget?", options: ["Use only peak current", "Sum each mode's current × duty cycle, plus sleep current, then divide battery capacity by the average", "Ignore duty cycle", "Use datasheet typical current at 25°C only"], correct: 1, explain: "Average current — weighted by how much time is spent in each mode — is what determines real-world battery life." },
      { q: "Why prefer wake-on-event (interrupt-driven) architecture over continuous polling in a battery device?", options: ["It's easier to code", "It keeps the system in low-power sleep except when an actual event occurs, cutting average current", "It has no effect on power", "It increases MCU clock speed"], correct: 1, explain: "Polling forces periodic wake-ups even with nothing to do; interrupts let the system sleep until truly needed." },
      { q: "As a primary-cell battery nears end-of-life, its internal impedance rises. What should low-power design account for?", options: ["Nothing — voltage is constant", "Brown-out/graceful shutdown behavior under drooping voltage and rising ESR", "Only manufacturing tolerance", "Only temperature effects"], correct: 1, explain: "Rising ESR causes larger voltage sag under load as the battery ages — the system must degrade gracefully, not crash." },
    ],
    practice: "Build a simple spreadsheet power budget for a hypothetical low-power sensor node: list each operating mode, its current draw and duty cycle, compute average current, and estimate battery life for a coin cell. This is exactly the kind of quantitative deliverable this role expects.",
  },
  {
    id: "instrumentation",
    title: "Debug Instrumentation Mastery",
    jdRef: "Hands-on debugging with oscilloscope, multimeter, logic analyzer",
    summary:
      "Likely your strongest area already as an EE Technician — the goal here is to sharpen the *why*, since interviews probe reasoning, not just tool familiarity.",
    concepts: [
      "Oscilloscope: probe grounding/loading matters — short ground leads, correct probe compensation, and appropriate bandwidth/sample rate to avoid aliasing artifacts.",
      "Multimeter: know when to trust a DC average reading vs. needing a scope for switching/AC content; understand input-impedance loading on high-impedance nodes.",
      "Logic analyzer: use protocol decode (I2C/SPI/UART) to debug digital comms; align sample clock and threshold voltage to the logic family.",
      "Systematic debug: form a hypothesis, pick the right tool to test it, document findings — don't randomly probe.",
      "Signal-integrity basics: ringing/overshoot from impedance mismatch, ground bounce, crosstalk — recognizable scope signatures.",
    ],
    flashcards: [
      { f: "Why use a short ground lead/spring tip on a scope probe?", b: "Minimizes ground-loop inductance, avoiding ringing artifacts introduced by the measurement itself." },
      { f: "When would a DMM reading mislead you on a switching node?", b: "A DMM shows only the DC average; a scope is needed to see switching transients/ripple." },
      { f: "What does a logic analyzer protocol decoder do?", b: "Translates raw digital transitions into readable bus transactions — I2C addresses, SPI bytes, etc." },
      { f: "What scope artifact suggests an impedance mismatch/reflection?", b: "Ringing or overshoot on a fast edge." },
    ],
    quiz: [
      { q: "Ringing appears on a fast digital edge only when using a long scope probe ground lead. What's happening?", options: ["The circuit is broken", "Ground-lead inductance is adding a measurement artifact", "The DUT power supply is bad", "The logic analyzer is miscalibrated"], correct: 1, explain: "A long ground lead adds inductance that resonates with probe capacitance, creating ringing that isn't really on the DUT." },
      { q: "A DMM reads a stable 3.3V on a switching regulator's output, but the board misbehaves. Next step?", options: ["Nothing — DMM confirms it's fine", "Use a scope to check for ripple/transients the DMM's averaging hides", "Replace the DMM", "Assume the regulator is fine forever"], correct: 1, explain: "DMMs average; a scope reveals ripple, glitches, or transients invisible to a DC meter." },
      { q: "What's the value of a logic analyzer's protocol decoder for I2C debug?", options: ["It measures voltage only", "It converts raw digital edges into readable addresses/data/ACK bits", "It replaces the need for a scope entirely", "It only works on analog signals"], correct: 1, explain: "Protocol decode turns a wall of transitions into readable bus transactions, dramatically speeding up debug." },
      { q: "Systematic hardware debug best practice is to:", options: ["Randomly probe test points until something looks wrong", "Form a hypothesis about the failure, choose the right instrument to test it, and document results", "Always replace the whole board", "Skip documentation to save time"], correct: 1, explain: "Hypothesis-driven debug is faster and produces reusable knowledge; random probing rarely converges efficiently." },
      { q: "Which is a scope signature of an impedance-mismatched trace?", options: ["A perfectly flat DC level", "Ringing/overshoot on a fast transition", "A constant slow ramp", "No signal at all"], correct: 1, explain: "Reflections from an impedance discontinuity show up as ringing/overshoot right after a fast edge." },
    ],
    practice: "Next time you're on the bench, deliberately compare a DMM reading and a scope capture on the same switching or PWM node, and write down in one sentence why they tell you different things. That story is interview gold.",
  },
  {
    id: "embedded",
    title: "Embedded Systems Interfacing",
    jdRef: "Experience with embedded devices",
    summary:
      "Hardware/firmware co-debug — knowing whether a bug lives in silicon or in code, and proving it with instrumentation.",
    concepts: [
      "Common comms buses: I2C (open-drain, needs pull-ups), SPI (CPOL/CPHA clock modes must match), UART (baud/framing) — each has characteristic failure modes.",
      "Power-on reset and boot sequencing must be verified independently of firmware — an MCU won't run code if reset/clock delivery isn't clean.",
      "Firmware/hardware co-debug: use the scope/analyzer as ground truth to tell whether a signal is missing/malformed (hardware) vs. present-but-ignored (firmware).",
      "In-circuit debug/programming interfaces (JTAG/SWD) have their own electrical requirements (logic levels, pull-ups) relevant to hardware bring-up.",
      "Real-time/interrupt timing issues often show up as intermittent bugs — long-capture logic analyzer traces help catch rare events.",
    ],
    flashcards: [
      { f: "Why does I2C need pull-up resistors?", b: "It's open-drain; pull-ups define the idle-high level and control rise time." },
      { f: "What happens if SPI CPOL/CPHA (clock mode) is mismatched?", b: "Data is sampled on the wrong edge, causing garbled or absent communication." },
      { f: "How do you distinguish a hardware vs. firmware bug at bring-up?", b: "Check with a scope/analyzer whether the correct signal is actually present; if present but ignored, suspect firmware." },
      { f: "What is JTAG/SWD used for?", b: "In-circuit programming and debug access to the MCU." },
    ],
    quiz: [
      { q: "An I2C bus's clock toggles but SDA never reaches a clean logic level. Likely cause?", options: ["Firmware bug", "Missing/incorrect pull-up resistors on SDA/SCL", "Wrong baud rate", "Bad crystal"], correct: 1, explain: "Open-drain I2C lines float without pull-ups, producing weak/indeterminate logic levels." },
      { q: "SPI fails intermittently; the analyzer shows the MCU sampling data one clock edge too early. Likely cause?", options: ["Bad connector", "CPOL/CPHA (clock mode) mismatch between master and slave", "Insufficient decoupling", "Wrong I2C address"], correct: 1, explain: "SPI has 4 clock-mode combinations; a mismatch shifts the sampling edge relative to data validity." },
      { q: "How do you determine whether a 'no response' bug is hardware or firmware?", options: ["Assume it's always firmware", "Use a scope/logic analyzer to confirm the expected signal is present and correctly formed at the pin", "Replace the MCU without investigation", "Reflash firmware repeatedly without measurement"], correct: 1, explain: "Ground-truth instrumentation tells you definitively which side of the hardware/software boundary the fault is on." },
      { q: "Why might an MCU fail to boot even with correct firmware loaded?", options: ["Firmware is always at fault", "Unclean reset or clock delivery prevents the core from starting regardless of firmware", "The IDE version is wrong", "The BOM has too many parts"], correct: 1, explain: "Reset and clock are prerequisites for any code execution — a hardware issue there masquerades as a firmware failure." },
      { q: "What's a good tool for catching a rare, intermittent timing bug in a digital interface?", options: ["A DMM", "A logic analyzer with a long capture buffer, triggered on the rare condition", "A ruler", "Visual inspection only"], correct: 1, explain: "Long captures with a specific trigger condition are built for catching infrequent, timing-sensitive events." },
    ],
    practice: "If you have access to a dev kit (Arduino/STM32/etc.), deliberately misconfigure SPI clock mode or remove an I2C pull-up, then capture the failure with a logic analyzer so you recognize the signature next time it happens for real.",
  },
  {
    id: "testarch",
    title: "Automated Test System Architecture",
    jdRef: "Automated test systems for Continuous, Characterization, DV, and Production; reusable toolsets",
    summary:
      "The architectural thinking behind 'next-generation automation systems' — this is where you show systems-level, not just scripting, thinking.",
    concepts: [
      "Test systems span four phases: Characterization (exploratory, wide margin sweeps) → Design Verification (pass/fail vs. locked spec) → Continuous/regression test → Production test (fast, pass/fail, high volume).",
      "Good architecture separates instrument drivers, test sequencing/logic, data logging, and UI/reporting into reusable layers — the same toolset then serves DV and production with different test plans.",
      "'Reusable toolsets/assets' means building an instrument abstraction layer once (e.g., a SCPI/VISA wrapper) and composing test steps from it, rather than one-off scripts per project.",
      "Test station design includes fixturing/DUT interface, instrument selection, safety/interlocks, and traceability (unit serial number, logged results) for medical device requirements.",
      "Validating the test software itself — per the JD — uses unit/integration tests and simulators/mocks that mimic hardware, so test logic is verified without needing a physical DUT every run.",
    ],
    flashcards: [
      { f: "Difference between Characterization and Design Verification testing?", b: "Characterization explores margins broadly (exploratory); DV confirms pass/fail against a locked spec." },
      { f: "Why build an instrument abstraction layer?", b: "Lets test scripts reuse the same interface across instruments/projects, reducing duplicated code." },
      { f: "What is a DUT simulator used for in test software validation?", b: "It mimics hardware responses so test logic can be validated without a physical unit — enabling CI-style automated testing." },
      { f: "Why is traceability (serial number + result logging) required in medical device test systems?", b: "It supports the Design History File / quality system and post-market traceability requirements." },
    ],
    quiz: [
      { q: "What best describes 'Design Verification' testing in the product lifecycle?", options: ["Exploratory margin sweeps with no pass/fail criteria", "Structured tests confirming the design meets its locked specification", "Manufacturing floor test only", "A marketing demo"], correct: 1, explain: "DV is specifically about confirming the finalized design meets its requirements." },
      { q: "Why would a test system architecture include a hardware/DUT simulator?", options: ["To replace real testing entirely", "To validate the test software's logic without needing a physical unit every run", "It's required by Altium", "To reduce instrument cost"], correct: 1, explain: "This is exactly the JD's call-out: 'simulators that mimic hardware and product behavior' for validating test software." },
      { q: "The JD asks for 'reusable toolsets/assets' in test automation architecture. This best means:", options: ["Rewriting scripts from scratch for every project", "Building shared instrument-driver and test-sequencing libraries that multiple test plans can reuse", "Using only manual testing", "Avoiding version control"], correct: 1, explain: "Reusability comes from a shared, well-abstracted architecture, not one-off scripts." },
      { q: "Which test phase is optimized for speed and simple pass/fail at high volume?", options: ["Characterization", "Production test", "Design exploration", "Simulation"], correct: 1, explain: "Production test must be fast and decisive since it runs on every unit built." },
      { q: "Why log unit serial numbers with every automated test result at a medical device company?", options: ["It's optional", "It supports traceability required by the quality system / Design History File, and enables post-market investigation", "It slows testing for no benefit", "Only firmware needs serial numbers"], correct: 1, explain: "Traceability from test result back to a specific unit is a quality-system expectation in regulated industries." },
    ],
    practice: "Sketch (on paper or in a diagram tool) a layered architecture for a test station: Instrument Driver Layer → Test Sequence Layer → Data Logging/Reporting Layer → UI. Be ready to describe this in an interview when asked how you'd design 'next-generation' test automation.",
  },
  {
    id: "csharp",
    title: "C# for Test Automation",
    jdRef: "2+ years C, C++, or C# for electrical test automation",
    summary:
      "The other explicitly named, hard qualification gap. Focus on instrument-control patterns, not general C# syntax trivia.",
    concepts: [
      "Core language basics: classes/objects, interfaces (ideal for instrument abstraction), exception handling (critical for instrument-timeout scenarios), async/await for long-running instrument I/O.",
      "Instrument communication commonly uses VISA (via NI-VISA/IVI) and SCPI text commands over GPIB/USB/Ethernet/serial — a C# wrapper class issues SCPI strings and parses responses.",
      "Good design separates 'instrument driver' classes from 'test sequence/logic' classes from 'reporting/data logging' classes — mirroring the reusable-toolset architecture goal.",
      "Testing your own test software: NUnit/xUnit/MSTest for unit tests of parsing/logic, with mocked instrument interfaces so tests run without hardware.",
      "Data handling: log results to CSV/database and compute pass/fail against spec limits programmatically, not manually.",
    ],
    flashcards: [
      { f: "What is SCPI?", b: "Standard Commands for Programmable Instruments — a text command syntax (e.g. 'MEAS:VOLT:DC?') used to control test instruments." },
      { f: "Why define an IInstrument interface in C#?", b: "Lets you swap real hardware for a mock/simulator in unit tests, and swap instrument brands without changing test logic." },
      { f: "Why use async/await for instrument calls?", b: "Instrument I/O (GPIB/serial) is slow/blocking; async keeps the test runner/UI responsive while waiting." },
      { f: "Benefit of unit-testing test-sequence logic with a mocked instrument?", b: "Catches logic bugs (pass/fail thresholds, sequencing) without needing physical hardware or risking a DUT." },
    ],
    quiz: [
      { q: "In C#, why wrap instrument communication behind an interface (e.g. IPowerSupply)?", options: ["It's required by C# syntax", "It decouples test logic from a specific instrument, enabling mocking and easy hardware swaps", "It makes the code slower", "It removes the need for SCPI"], correct: 1, explain: "Interfaces are the standard way to decouple logic from a concrete implementation, enabling both testability and portability." },
      { q: "A SCPI query like 'MEAS:VOLT:DC?' returns a string. What should robust C# instrument code do?", options: ["Assume it always parses correctly", "Validate/parse the response with error handling (try/catch, timeout) since instrument I/O can fail", "Ignore the response", "Restart the whole test station"], correct: 1, explain: "Instrument comms are inherently unreliable (timeouts, malformed responses) and must be handled defensively." },
      { q: "Main reason to mock the instrument layer in a unit test for test-sequence logic?", options: ["Mocks make real hardware run faster", "It verifies pass/fail and sequencing logic deterministically without needing a physical DUT/instrument", "Mocking is required by C#", "It replaces the need for DV testing"], correct: 1, explain: "Mocking isolates the logic under test from hardware variability, enabling fast, repeatable, hardware-free unit tests." },
      { q: "Why is async/await useful when polling a slow GPIB instrument?", options: ["No real benefit", "It avoids blocking the calling thread while waiting on slow I/O, keeping the test runner/UI responsive", "It makes SCPI commands shorter", "It's only for web apps"], correct: 1, explain: "Async I/O prevents a slow instrument response from freezing the rest of the application." },
      { q: "Which C# testing framework would you use to unit test a class that computes pass/fail against spec limits?", options: ["Altium DRC", "NUnit/xUnit/MSTest", "Cadence", "SCPI"], correct: 1, explain: "These are the standard .NET unit-testing frameworks." },
    ],
    practice: "Write a small C# console app with an `IInstrument` interface, a `FakeInstrument` mock implementation, and a `PowerSupplyTest` class that reads a mocked voltage and returns pass/fail against limits — then write an NUnit test for it. This single project directly answers the JD's C# + reusable-toolset + test-of-test-software asks.",
  },
  {
    id: "stats",
    title: "Statistical Methods for Test & Data Analysis",
    jdRef: "Execute tests and analyze data using statistical methods to influence design choices",
    summary:
      "Turning raw test data into a defensible engineering decision — a skill that's assumed, not taught, at this level.",
    concepts: [
      "Descriptive stats (mean, std dev, range) summarize test data — always look at distribution shape, not just the mean, before concluding 'it passes.'",
      "Process capability (Cp/Cpk) quantifies whether a process/design consistently stays within spec limits relative to its variation — Cpk ≥ 1.33 is a common medical-device target.",
      "Gage R&R (repeatability & reproducibility) quantifies how much measured variation comes from the measurement system itself vs. true part-to-part variation — run this before trusting new test data.",
      "Hypothesis testing (t-tests, ANOVA) determines if an observed difference between design revisions or lots is statistically significant vs. noise.",
      "Control charts (X-bar/R) monitor a process over time to detect drift or special-cause variation in production test data.",
    ],
    flashcards: [
      { f: "What does Cpk measure?", b: "How well a process's actual spread fits within spec limits, accounting for how centered it is." },
      { f: "Why run a Gage R&R before trusting a new test station's data?", b: "To confirm measurement variation is small relative to actual part variation, so you're not chasing measurement noise." },
      { f: "When would you use a t-test in engineering data analysis?", b: "To determine if the difference between two groups (e.g., old vs. new design revision) is statistically significant." },
      { f: "What does a control chart detect that a single measurement can't?", b: "Drift or special-cause variation in a process over time." },
    ],
    quiz: [
      { q: "A production test station's Cpk for a critical parameter is 0.9. What does this suggest?", options: ["The process comfortably meets spec", "The process variation is too large relative to spec limits — real defects are likely reaching the field", "The test station needs no attention", "Cpk is irrelevant to production"], correct: 1, explain: "Cpk below 1.0 means the natural process spread doesn't reliably fit inside the spec window — a red flag." },
      { q: "Before trusting measurements from a brand-new automated test station, what study should you run?", options: ["A single sample measurement", "A Gage R&R study to separate measurement-system variation from true part variation", "Skip straight to production", "A dFMEA only"], correct: 1, explain: "Gage R&R validates the measurement system itself before you trust any conclusions drawn from its data." },
      { q: "You suspect a new PCB revision reduced noise vs. the old revision. What tool tells you if the difference is real vs. random?", options: ["A pie chart", "A two-sample t-test (or ANOVA for more groups)", "A Gantt chart", "A Kanban board"], correct: 1, explain: "Hypothesis testing quantifies whether an observed difference is statistically significant." },
      { q: "In production, a control chart shows several consecutive points trending upward but still within spec. What should this trigger?", options: ["Nothing — they're within spec so ignore it", "Investigation of special-cause drift before it produces out-of-spec units", "Immediate line shutdown, always", "A firmware rewrite"], correct: 1, explain: "Control charts exist to catch drift before it becomes a defect — a trend is an early warning even if still in-spec." },
      { q: "Why look at the full distribution (histogram) of test results, not just the average?", options: ["Averages always tell the whole story", "A 'passing' average can hide a bimodal distribution or outliers that reveal a real problem", "Distribution shape is irrelevant in engineering", "It's only useful for marketing"], correct: 1, explain: "Two very different populations can share the same mean — the shape reveals what the average hides." },
    ],
    practice: "Take any repeated measurement you've made on the bench (even 10-20 readings of the same thing), compute mean/std dev in a spreadsheet, and calculate a rough Cpk against a made-up spec. Getting comfortable with the formula beats recognizing the term.",
  },
  {
    id: "dfmea",
    title: "Risk Management & dFMEA",
    jdRef: "Risk assessment/mitigation; ability to perform dFMEA analysis independently",
    summary:
      "A formal methodology named explicitly in the JD ('independently') — this is likely to come up directly in a technical interview.",
    concepts: [
      "dFMEA (Design Failure Mode and Effects Analysis) systematically identifies how a design could fail, the effect of that failure, and its cause — done proactively during design, not after.",
      "Each failure mode is scored on Severity (S), Occurrence (O), and Detection (D); multiplied together to get an RPN (Risk Priority Number) to prioritize which risks need mitigation.",
      "Mitigation follows a hierarchy: design change first (preferred), then process control, then detection/warning (least preferred) — matching ISO 14971's risk-control hierarchy for medical devices.",
      "'Residual risk' is what remains after mitigation — it must be explicitly evaluated and, in medical devices, justified as acceptable relative to benefit.",
      "dFMEA is a living document — revisit it after design changes, test failures, or field issues, not just once at kickoff.",
    ],
    flashcards: [
      { f: "What does RPN stand for and how is it calculated?", b: "Risk Priority Number = Severity × Occurrence × Detection." },
      { f: "What's the preferred order of risk mitigation?", b: "Design change first, then process control, then detection/warning (least preferred)." },
      { f: "What is 'residual risk'?", b: "The risk remaining after mitigations are applied, which must be evaluated as acceptable." },
      { f: "Why is dFMEA a 'living document' in medical device development?", b: "New failure modes surface from test results/field data, requiring updates throughout the lifecycle." },
    ],
    quiz: [
      { q: "A dFMEA finds a high-Severity failure mode, and the team's only plan is a warning label. What should be considered first?", options: ["Nothing — warnings are always sufficient", "Whether a design change can eliminate or reduce the failure mode before relying on detection/warning", "Increasing the RPN score", "Removing the failure mode from the dFMEA"], correct: 1, explain: "The risk-control hierarchy strongly prefers design changes over warnings, which depend on a person noticing and acting correctly." },
      { q: "RPN is calculated as:", options: ["Severity + Occurrence + Detection", "Severity × Occurrence × Detection", "Severity only", "Detection only"], correct: 1, explain: "RPN multiplies all three factors together to produce a prioritization score." },
      { q: "After a bring-up debug reveals a new failure mode not previously considered, what should happen to the dFMEA?", options: ["Nothing — it's finalized at kickoff", "It should be updated to include the new failure mode and re-assessed", "It should be deleted", "It only applies to firmware"], correct: 1, explain: "dFMEA must evolve as new information (like a real failure) becomes available." },
      { q: "What is 'residual risk'?", options: ["The risk before any mitigation", "The risk that remains after mitigations are applied, which must be justified as acceptable", "A risk that no longer exists", "A term unrelated to dFMEA"], correct: 1, explain: "No mitigation eliminates risk entirely — what's left over is residual risk, and it must be formally accepted." },
      { q: "Why does ISO 14971 (medical device risk management) prefer design changes over user warnings as risk control?", options: ["Design changes are always cheaper", "Design changes remove the hazard at the source and don't rely on a person noticing/acting on a warning", "Warnings are always more effective", "There's no preference"], correct: 1, explain: "Warnings depend on human behavior, which is inherently less reliable than removing the hazard by design." },
    ],
    practice: "Pick any device or circuit you've worked on and run a mini dFMEA on paper: list 3 plausible failure modes, their effects, likely causes, and score S/O/D (1-10 each) to get an RPN. Being able to walk through this exercise live is the actual interview test.",
  },
  {
    id: "regulatory",
    title: "Medical Device Design Controls & Regulatory",
    jdRef: "Regulated industry (medical device) experience preferred; design reviews",
    summary:
      "The 'highly regulated industry' context that shapes everything else in this role — quality-system vocabulary you'll be expected to use fluently.",
    concepts: [
      "Design controls (21 CFR 820.30 in the US, mirrored by ISO 13485) require documented design inputs, outputs, verification, validation, and formal design reviews at defined phases.",
      "Design reviews (called out explicitly in the JD) are formal, documented checkpoints where stakeholders critique the design against requirements — not just a status update.",
      "IEC 60601 governs electrical safety/EMC for medical electrical equipment; active implantable devices (like neuromodulation systems) add further collateral/particular standards.",
      "The Design History File (DHF) compiles all design control records — traceable evidence that verification/validation was performed for every requirement.",
      "Verification asks 'did we build the design right?' (matches spec); Validation asks 'did we build the right design?' (meets user needs/intended use) — a frequently tested distinction.",
    ],
    flashcards: [
      { f: "Verification vs. Validation — what's the difference?", b: "Verification confirms the design meets its specified requirements; Validation confirms the design meets user needs/intended use." },
      { f: "What is the Design History File (DHF)?", b: "The compiled record of all design control documentation, showing traceable evidence of proper development." },
      { f: "What does IEC 60601 address?", b: "Electrical safety and EMC requirements for medical electrical equipment." },
      { f: "Why are design reviews formal, documented events rather than casual status meetings?", b: "They're a design-control requirement providing critical, recorded feedback and risk visibility at each phase." },
    ],
    quiz: [
      { q: "A test confirms amplifier gain matches the specified 40dB ± 1dB. Is this verification or validation?", options: ["Validation", "Verification", "Neither", "Both equally"], correct: 1, explain: "Confirming a measurable spec was met is verification." },
      { q: "A usability study confirms clinicians can safely operate the device as intended in real use. Verification or validation?", options: ["Verification", "Validation", "Neither", "dFMEA"], correct: 1, explain: "Confirming the device meets real-world user needs and intended use is validation." },
      { q: "What is the primary purpose of the Design History File?", options: ["Marketing material", "Traceable, compiled evidence that design controls (inputs, outputs, V&V, reviews) were properly executed", "The company's org chart", "The BOM only"], correct: 1, explain: "The DHF is the audit-ready record proving the design process was followed correctly." },
      { q: "Which standard is most directly relevant to electrical safety/EMC of a neuromodulation device?", options: ["ISO 9001", "IEC 60601 (with active-implant collateral standards)", "IPC-A-610 only", "RoHS"], correct: 1, explain: "IEC 60601 is the core medical electrical equipment safety/EMC standard family." },
      { q: "Why does the JD emphasize 'periodic design reviews' as a formal responsibility?", options: ["They're optional social meetings", "They're a required, documented design-control checkpoint for stakeholder feedback and risk visibility", "They replace dFMEA", "They only happen once at project end"], correct: 1, explain: "Design reviews are a design-control requirement, not just a nice-to-have status sync." },
    ],
    practice: "If your current company has design control / quality procedures, read through one real design review record or DHF excerpt (redacted/approved for viewing) to see the actual structure and vocabulary used in practice.",
  },
  {
    id: "writing",
    title: "Technical Writing & Design Reviews",
    jdRef: "Write technical specifications/requirements; strong written and oral communication",
    summary:
      "Explicitly called out as a required skill — testable requirements and clear findings are what separate senior engineers from junior ones.",
    concepts: [
      "A good technical specification states requirements as testable, unambiguous statements ('shall' statements with numeric limits) — not vague goals.",
      "Structure specs/requirements so each traces to a verification test — this traceability is exactly what auditors and design reviewers check.",
      "Design review presentations should lead with the decision/ask, show data (not just claims), and proactively surface risks/open items rather than hiding them.",
      "Written communication to cross-functional stakeholders (firmware, RF, quality, regulatory) needs to translate EE-specific detail into the audience's context.",
      "Document debug/characterization findings clearly — what was tested, method, result, conclusion — so your work is reusable by the whole team.",
    ],
    flashcards: [
      { f: "What makes a requirement 'testable'?", b: "It states a measurable, numeric, verifiable condition rather than a vague goal." },
      { f: "Why trace each requirement to a verification test?", b: "Ensures every requirement is actually confirmed, and supports audit/DHF completeness." },
      { f: "What should lead a design review presentation?", b: "The decision/ask and the data supporting it, plus open risks — not just a status narrative." },
      { f: "Why surface risks/open items explicitly in a design review rather than downplaying them?", b: "Design reviews exist to get critical feedback early, when it's cheap to change course." },
    ],
    quiz: [
      { q: "Which is a well-written, testable requirement?", options: ["\"The device should be low power\"", "\"Average current draw in standby shall not exceed 5 µA at 25°C\"", "\"Make it efficient\"", "\"Battery should last a while\""], correct: 1, explain: "It's specific, numeric, has a stated condition, and is directly verifiable by test." },
      { q: "Why should every requirement trace to a specific verification test?", options: ["It's just paperwork", "It ensures the requirement is objectively confirmed and supports design-control/audit traceability", "It's optional in medical devices", "Only firmware requirements need this"], correct: 1, explain: "Untested requirements are unverified claims — traceability closes that gap." },
      { q: "What should a design review presentation prioritize?", options: ["A long history of all past meetings", "The key decision/ask, supporting data, and open risks", "Only good news", "Skipping data to save time"], correct: 1, explain: "Reviewers need the decision and evidence to give useful, timely feedback." },
      { q: "When writing to firmware and quality stakeholders about an EE characterization result, you should:", options: ["Use only EE jargon", "Translate the finding's meaning and implication into terms relevant to their concerns", "Withhold the data", "Only communicate verbally, never in writing"], correct: 1, explain: "Effective cross-functional communication adapts to the audience's context, not just the author's." },
      { q: "Why document debug methodology, not just the final fix?", options: ["It's unnecessary overhead", "It makes the investigation reusable/auditable by teammates facing similar issues later", "Documentation is only for regulatory submissions", "It slows down the team"], correct: 1, explain: "Good documentation compounds — the next engineer with a similar symptom benefits from your method, not just your fix." },
    ],
    practice: "Take a recent piece of test/debug work and rewrite its summary as: (1) one 'shall' requirement it was checking, (2) method, (3) result with data, (4) conclusion/recommendation. Practicing this format builds the muscle this role expects daily.",
  },
  {
    id: "agile",
    title: "Agile Project Management & Mentoring",
    jdRef: "Kanban, milestones, risk/contingency planning, mentoring interns, stand-ups",
    summary:
      "The 'soft' project-management layer wrapped around all the technical work — often underestimated in prep, but explicitly listed multiple times in the JD.",
    concepts: [
      "Kanban visualizes work-in-progress and limits it, pulling new items only as capacity allows — distinct from Scrum's fixed sprints, though both typically use daily stand-ups and prioritized backlogs.",
      "Good milestone/deliverable planning defines clear exit criteria per phase, tracks progress against them, and builds contingency into the schedule for known risk areas.",
      "Retrospectives are structured (what went well / what didn't / action items) and should produce concrete process changes, not just discussion.",
      "Mentoring interns effectively means giving them scoped, real ownership with regular checkpoints — not just answering questions reactively.",
      "Stand-ups exist to surface blockers concisely (what I did, what's next, what's blocking me) — not to deliver detailed status reports.",
    ],
    flashcards: [
      { f: "Kanban vs. Scrum — key difference?", b: "Kanban is continuous flow with WIP limits; Scrum uses fixed-length sprints with sprint planning/review." },
      { f: "What are the 3 standard stand-up questions?", b: "What I did yesterday, what I'm doing today, what's blocking me." },
      { f: "What makes a retrospective effective?", b: "It produces specific, owned action items, not just a discussion." },
      { f: "What's a good way to mentor an intern, per the JD's expectations?", b: "Give scoped real ownership with regular checkpoints and constructive feedback, not just answering ad hoc questions." },
    ],
    quiz: [
      { q: "What's a defining feature of a Kanban board?", options: ["Fixed 2-week sprints", "Continuous flow of work with explicit work-in-progress limits", "No prioritization", "No visualization of work"], correct: 1, explain: "WIP limits and continuous pull-based flow are what distinguish Kanban from sprint-based methods." },
      { q: "A retrospective ends with 'that was a tough sprint' and no follow-up. What's missing?", options: ["Nothing — that's sufficient", "Specific, owned action items to actually change the process", "A pizza party", "A new Kanban board"], correct: 1, explain: "Retrospectives are only valuable if they produce concrete changes, not just venting." },
      { q: "Effective intern mentoring, per the JD's 'mentor and coach' responsibility, looks like:", options: ["Answering questions only when interrupted", "Assigning scoped real work with regular checkpoints and feedback tied to their growth", "Doing their work for them", "No interaction until the project ends"], correct: 1, explain: "Real ownership plus regular, structured feedback is what develops an intern's skills." },
      { q: "What's the purpose of the daily stand-up?", options: ["A detailed hour-long status report", "A brief sync on progress and blockers to keep the team unblocked", "A design review", "A performance evaluation"], correct: 1, explain: "Stand-ups are intentionally short and blocker-focused, not comprehensive status reports." },
      { q: "When defining project milestones, why build in contingency for known risk areas?", options: ["It's unnecessary padding", "It protects the schedule from foreseeable risks, per the JD's 'manage project risks / contingency plans'", "Contingency is only for firmware", "Risk doesn't affect timelines"], correct: 1, explain: "Contingency planning is explicitly named in the JD as part of milestone/risk management." },
    ],
    practice: "If you've trained a coworker or new hire before, write one paragraph describing how you scoped their first real task and checked in on it — that's a ready-made STAR story for the mentoring question.",
  },
];

/* Behavioral / STAR interview prep bank, tied to specific JD responsibilities */
const STAR_BANK = [
  { topic: "Design Feasibility", question: "Tell me about a time you assessed the feasibility of a design concept before committing to it.", tips: "Pull directly from one of the boards you've designed for the R&D team: how you narrowed the concept space, part-selection tradeoffs you weighed, what a quick prototype told you, and what you'd have done differently." },
  { topic: "Board Bring-Up / Debug", question: "Describe a challenging board bring-up or hardware debug you led.", tips: "Use structured debug language: hypothesis, instrument used, isolation steps, root cause, fix, and how you verified it was actually fixed. You likely have a real story from bringing up one of your own boards — use it." },
  { topic: "Altium Layout Decisions", question: "Walk me through a layout decision you made on a board you designed — stack-up, return path, decoupling, or RF routing.", tips: "This is where your existing Altium experience becomes a direct advantage over other candidates — be ready with specifics: why you chose a stack-up, a DRC/ERC issue you caught, or a tradeoff you made under a size/cost constraint." },
  { topic: "Extreme Constraint Design", question: "Tell me about a time you had to design under a severe space, mechanical, or interface constraint.", tips: "Use the ~1cm x 1cm fix/patch board you designed to install onto an existing board — walk through why the fix was needed, how you handled component/footprint choices at that scale, how it mechanically and electrically interfaced with the existing board, and how you verified it worked once installed. This is a distinctive, hard-to-fake story most candidates won't have." },
  { topic: "Test Automation", question: "Tell me about test automation you've built or contributed to — or, if you haven't, how you'd approach building one.", tips: "If you lack direct experience, bridge with any scripting/data-logging you've done as an EE Tech, plus a concrete plan (see the C# module's practice project)." },
  { topic: "Statistics Influencing Design", question: "Give an example of using data or statistics to influence a design decision.", tips: "Even a simple 'I noticed the pass rate correlated with X, so we changed Y' story works — the key is quantified evidence, not just intuition." },
  { topic: "Risk Assessment / dFMEA", question: "Walk me through how you'd approach a dFMEA on a new design module.", tips: "Narrate the actual process: list failure modes, score S/O/D, calculate RPN, propose mitigation in the design-change-first hierarchy." },
  { topic: "Design Reviews", question: "Tell me about presenting a design or giving/receiving critical feedback in a design review.", tips: "Show you can take critical feedback constructively and that you proactively surface risks rather than hide them." },
  { topic: "Cross-Functional Collaboration", question: "Describe working with firmware, RF, or quality teams to resolve an issue.", tips: "Highlight translating your findings into terms relevant to their concerns, and reaching a decision together." },
  { topic: "Project Planning", question: "Tell me about managing a project's scope, timeline, milestones, and risks.", tips: "Mention concrete milestones, how you tracked progress, and a contingency plan you built for a known risk." },
  { topic: "Mentoring", question: "Describe mentoring or training someone less experienced than you.", tips: "Show scoped ownership + regular checkpoints, not just answering questions when asked." },
  { topic: "Agile/Kanban", question: "How have you used Agile or Kanban practices in your work?", tips: "Even informal prioritization/backlog management counts — describe how work was visualized and prioritized." },
  { topic: "Communicating Status", question: "Tell me about communicating project status — including bad news — to stakeholders.", tips: "Emphasize proactive, clear, data-backed communication rather than waiting to be asked." },
  { topic: "Staying Current", question: "How do you stay current with emerging tools/technologies in your field?", tips: "Point to concrete recent examples — this app itself is a great one to mention." },
  { topic: "Regulated Industry", question: "Tell me about working within a regulated or quality-controlled environment.", tips: "Discuss documentation discipline, traceability, or following formal procedures — even from an EE Technician vantage point." },
  { topic: "Bridging the Gap", question: "You don't have direct experience with Cadence simulation, C# test automation, or formal dFMEA — how would you ramp up?", tips: "Be honest and concrete: describe your self-study plan (this app!), transferable hands-on EE skills including your Altium board design work, and evidence you learn fast (e.g., finishing a Computer Engineering degree while working full-time)." },
];

/* Glossary */
const GLOSSARY = [
  { term: "PCBA", def: "Printed Circuit Board Assembly — a populated (assembled) PCB." },
  { term: "dFMEA", def: "Design Failure Mode and Effects Analysis — proactive identification and risk-scoring of ways a design could fail." },
  { term: "RPN", def: "Risk Priority Number = Severity × Occurrence × Detection, used to prioritize dFMEA risks." },
  { term: "Cpk", def: "Process capability index; quantifies how well a process's variation fits within spec limits, accounting for centering." },
  { term: "Gage R&R", def: "Gage Repeatability & Reproducibility — a study quantifying measurement-system variation vs. true part variation." },
  { term: "DHF", def: "Design History File — the compiled, traceable record of a medical device's design control documentation." },
  { term: "EVT / DVT / PVT", def: "Engineering Validation Test / Design Validation Test / Production Validation Test — sequential prototype/validation phases." },
  { term: "SCPI", def: "Standard Commands for Programmable Instruments — text command syntax used to control test instruments." },
  { term: "VISA", def: "Virtual Instrument Software Architecture — a standard API for communicating with test instruments regardless of physical interface." },
  { term: "IEC 60601", def: "International standard family for the electrical safety and EMC of medical electrical equipment." },
  { term: "ISO 14971", def: "International standard for risk management applied to medical devices." },
  { term: "ISO 13485", def: "International standard for a medical device quality management system." },
  { term: "21 CFR 820", def: "US FDA Quality System Regulation, including Design Controls (820.30) for medical devices." },
  { term: "Kanban", def: "A workflow method visualizing work as cards moving through columns, with explicit work-in-progress (WIP) limits." },
  { term: "WIP", def: "Work In Progress — the set of tasks currently being actively worked, limited in Kanban to improve flow." },
  { term: "Verification", def: "Confirming a design meets its specified, documented requirements ('built the design right')." },
  { term: "Validation", def: "Confirming a design meets user needs and intended use ('built the right design')." },
  { term: "Quiescent Current", def: "The current a circuit draws at idle/no-load — often dominant in mostly-sleeping, battery-powered devices." },
  { term: "Load Switch", def: "A component that fully disconnects power to a subsystem, eliminating leakage rather than just disabling it." },
  { term: "Control Chart", def: "A time-series chart (e.g., X-bar/R) used to detect process drift or special-cause variation." },
  { term: "ANOVA", def: "Analysis of Variance — a statistical test for whether means differ significantly across 3+ groups." },
  { term: "t-test", def: "A statistical test for whether the means of two groups differ significantly." },
  { term: "JTAG / SWD", def: "Standard in-circuit debug/programming interfaces for microcontrollers." },
  { term: "DRC / ERC", def: "Design Rule Check (physical layout rules) / Electrical Rule Check (schematic connectivity rules) in PCB CAD tools." },
  { term: "Loop Gain / Phase Margin", def: "Metrics from AC/frequency-domain analysis describing the stability of a feedback control loop (e.g., a voltage regulator)." },
  { term: "Monte Carlo Analysis", def: "A simulation technique that randomizes component tolerances across many runs to predict real-world performance spread." },
];
