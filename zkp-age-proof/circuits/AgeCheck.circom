pragma circom 2.0.0;

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1 = 0;
    var e2 = 1;
    for (var i = 0; i < n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] - 1) === 0;
        lc1 += out[i] * e2;
        e2 = e2 + e2;
    }
    lc1 === in;
}

template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;
    component n2b = Num2Bits(n+1);
    n2b.in <== in[0] + (1 << n) - in[1];
    out <== 1 - n2b.out[n];
}

template LessEqThan(n) {
    signal input in[2];
    signal output out;
    component lt = LessThan(n);
    lt.in[0] <== in[0];
    lt.in[1] <== in[1] + 1;
    out <== lt.out;
}

template AgeCheck() {
    // PRIVÉ — jamais transmis au vérificateur
    signal input birthYear;
    signal input birthMonth;
    signal input birthDay;

    // PUBLIC — connu du vérificateur
    signal input currentYear;
    signal input currentMonth;
    signal input currentDay;

    // Sortie : 1 si majeur, 0 sinon
    signal output isAdult;

    signal birthDays;
    signal currentDays;
    birthDays   <== birthYear * 365 + birthMonth * 30 + birthDay;
    currentDays <== currentYear * 365 + currentMonth * 30 + currentDay;

    signal ageDays;
    ageDays <== currentDays - birthDays;

    // 18 * 365 = 6570 jours
    component check = LessEqThan(32);
    check.in[0] <== 6570;
    check.in[1] <== ageDays;

    isAdult <== check.out;
}

component main {public [currentYear, currentMonth, currentDay]} = AgeCheck();