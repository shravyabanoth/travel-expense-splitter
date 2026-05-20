import React, { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [numPeople, setNumPeople] = useState("");
  const [people, setPeople] = useState([]);
  const [step, setStep] = useState(1);
  const [results, setResults] = useState({});

  const categories = [
    "Food",
    "Hotel",
    "Travel",
    "Fuel",
    "Shopping",
    "Other",
  ];

  const handleNumPeopleSubmit = (e) => {
    e.preventDefault();

    const count = parseInt(numPeople);

    if (count > 0) {
      const initialPeople = Array(count)
        .fill()
        .map((_, i) => ({
          id: i,
          name: "",
          expenses: [
            {
              amount: "",
              category: "Food",
            },
          ],
        }));

      setPeople(initialPeople);
      setStep(2);
    }
  };

  const handleNameChange = (index, value) => {
    const updated = [...people];
    updated[index].name = value;
    setPeople(updated);
  };

  const handleExpenseChange = (
    personIndex,
    expenseIndex,
    field,
    value
  ) => {
    const updated = [...people];
    updated[personIndex].expenses[
      expenseIndex
    ][field] = value;

    setPeople(updated);
  };

  const addExpense = (personIndex) => {
    const updated = [...people];

    updated[personIndex].expenses.push({
      amount: "",
      category: "Food",
    });

    setPeople(updated);
  };

  const calculateSplit = (e) => {
    e.preventDefault();

    let totalExpense = 0;
    const categoryTotals = {};

    const balances = people.map((person) => {
      const paid = person.expenses.reduce(
        (sum, exp) => {
          const amount =
            Number(exp.amount) || 0;

          totalExpense += amount;

          categoryTotals[exp.category] =
            (categoryTotals[
              exp.category
            ] || 0) + amount;

          return sum + amount;
        },
        0
      );

      return {
        name: person.name,
        paid,
        balance: 0,
      };
    });

    const equalShare =
      totalExpense / people.length;

    balances.forEach((person) => {
      person.balance =
        person.paid - equalShare;
    });

    const owes = balances.filter(
      (p) => p.balance < 0
    );

    const gets = balances.filter(
      (p) => p.balance > 0
    );

    const transactions = [];

    let i = 0;
    let j = 0;

    while (
      i < owes.length &&
      j < gets.length
    ) {
      const owePerson = owes[i];
      const getPerson = gets[j];

      const amount = Math.min(
        -owePerson.balance,
        getPerson.balance
      );

      transactions.push({
        from: owePerson.name,
        to: getPerson.name,
        amount: amount.toFixed(2),
      });

      owePerson.balance += amount;
      getPerson.balance -= amount;

      if (
        Math.abs(
          owePerson.balance
        ) < 0.01
      )
        i++;

      if (
        Math.abs(
          getPerson.balance
        ) < 0.01
      )
        j++;
    }

    setResults({
      totalExpense,
      equalShare:
        equalShare.toFixed(2),
      categoryTotals,
      transactions,
    });

    setStep(3);
  };

  const resetApp = () => {
    setStep(1);
    setPeople([]);
    setResults({});
    setNumPeople("");
  };

  const theme = {
    background: darkMode
      ? "#0f172a"
      : "#f1f5f9",

    card: darkMode
      ? "#1e293b"
      : "#ffffff",

    text: darkMode
      ? "#ffffff"
      : "#1e293b",

    secondaryText: darkMode
      ? "#cbd5e1"
      : "#64748b",

    inputBg: darkMode
      ? "#334155"
      : "#f8fafc",

    border: darkMode
      ? "#475569"
      : "#d1d5db",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    fontSize: "15px",
    marginBottom: "12px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        transition: "0.3s",
        fontFamily:
          "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: theme.card,
          borderRadius: "24px",
          padding: "35px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              color: theme.text,
            }}
          >
            Travel Expense Splitter
          </h1>

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            style={{
              padding:
                "10px 18px",
              borderRadius:
                "12px",
              border: "none",
              background:
                "#2563eb",
              color: "white",
              cursor:
                "pointer",
            }}
          >
            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>
        </div>

        <p
          style={{
            color:
              theme.secondaryText,
          }}
        >
          Split group expenses
          fairly
        </p>

        {step === 1 && (
          <form
            onSubmit={
              handleNumPeopleSubmit
            }
          >
            <input
              type="number"
              placeholder="Enter number of people"
              value={numPeople}
              onChange={(e) =>
                setNumPeople(
                  e.target.value
                )
              }
              style={inputStyle}
              required
            />

            <button
              style={{
                width: "100%",
                padding:
                  "14px",
                background:
                  "#2563eb",
                color:
                  "white",
                border:
                  "none",
                borderRadius:
                  "12px",
                cursor:
                  "pointer",
              }}
            >
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={
              calculateSplit
            }
          >
            {people.map(
              (
                person,
                personIndex
              ) => (
                <div
                  key={
                    person.id
                  }
                  style={{
                    background:
                      theme.inputBg,
                    padding:
                      "20px",
                    borderRadius:
                      "18px",
                    marginBottom:
                      "20px",
                  }}
                >
                  <input
                    type="text"
                    placeholder={`Person ${
                      personIndex +
                      1
                    } Name`}
                    value={
                      person.name
                    }
                    onChange={(
                      e
                    ) =>
                      handleNameChange(
                        personIndex,
                        e
                          .target
                          .value
                      )
                    }
                    style={
                      inputStyle
                    }
                    required
                  />

                  {person.expenses.map(
                    (
                      expense,
                      expenseIndex
                    ) => (
                      <div
                        key={
                          expenseIndex
                        }
                      >
                        <input
                          type="number"
                          placeholder="Amount"
                          value={
                            expense.amount
                          }
                          onChange={(
                            e
                          ) =>
                            handleExpenseChange(
                              personIndex,
                              expenseIndex,
                              "amount",
                              e
                                .target
                                .value
                            )
                          }
                          style={
                            inputStyle
                          }
                          required
                        />

                        <select
                          value={
                            expense.category
                          }
                          onChange={(
                            e
                          ) =>
                            handleExpenseChange(
                              personIndex,
                              expenseIndex,
                              "category",
                              e
                                .target
                                .value
                            )
                          }
                          style={
                            inputStyle
                          }
                        >
                          {categories.map(
                            (
                              cat
                            ) => (
                              <option
                                key={
                                  cat
                                }
                              >
                                {
                                  cat
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      addExpense(
                        personIndex
                      )
                    }
                    style={{
                      background:
                        "#10b981",
                      color:
                        "white",
                      border:
                        "none",
                      padding:
                        "10px 14px",
                      borderRadius:
                        "10px",
                      cursor:
                        "pointer",
                    }}
                  >
                    + Add Expense
                  </button>
                </div>
              )
            )}

            <button
              style={{
                width: "100%",
                padding:
                  "14px",
                background:
                  "#2563eb",
                color:
                  "white",
                border:
                  "none",
                borderRadius:
                  "12px",
                cursor:
                  "pointer",
              }}
            >
              Calculate Split
            </button>
          </form>
        )}

        {step === 3 && (
          <div>
            <h2
              style={{
                color:
                  theme.text,
              }}
            >
              Total Expense:
              ₹
              {
                results.totalExpense
              }
            </h2>

            <h3
              style={{
                color:
                  theme.text,
              }}
            >
              Equal Share:
              ₹
              {
                results.equalShare
              }
            </h3>

            <h3
              style={{
                color:
                  theme.text,
              }}
            >
              Category Summary
            </h3>

            {Object.entries(
              results.categoryTotals
            ).map(
              ([
                cat,
                amount,
              ]) => (
                <div
                  key={cat}
                  style={{
                    background:
                      theme.inputBg,
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    marginBottom:
                      "10px",
                    color:
                      theme.text,
                  }}
                >
                  {cat}: ₹
                  {amount}
                </div>
              )
            )}

            <h3
              style={{
                color:
                  theme.text,
              }}
            >
              Settlement
            </h3>

            {results
              .transactions
              .length >
            0 ? (
              results.transactions.map(
                (
                  t,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    style={{
                      background:
                        theme.inputBg,
                      padding:
                        "14px",
                      borderRadius:
                        "10px",
                      marginBottom:
                        "10px",
                      color:
                        theme.text,
                    }}
                  >
                    <strong>
                      {t.from}
                    </strong>{" "}
                    pays ₹
                    {t.amount} to{" "}
                    <strong>
                      {t.to}
                    </strong>
                  </div>
                )
              )
            ) : (
              <p
                style={{
                  color:
                    theme.secondaryText,
                }}
              >
                Everyone is settled.
              </p>
            )}

            <button
              onClick={
                resetApp
              }
              style={{
                width: "100%",
                padding:
                  "14px",
                background:
                  "#ef4444",
                color:
                  "white",
                border:
                  "none",
                borderRadius:
                  "12px",
                cursor:
                  "pointer",
                marginTop:
                  "20px",
              }}
            >
              Start Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;