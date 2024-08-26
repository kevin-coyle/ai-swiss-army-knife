export const data = [
  {
    name: "John Doe",
    age: {
      type: "progress", max: "82", value: 55
    },
    email: {
      type: "tag", value: "email@email.com", icon: "email", variant: "success"
    },
    indicator: "primary",
  },
  {
    name: "Jane Smith",
    age: 34,
    email: "jane@example.com",
    indicator: "secondary",
    disabled: true
  },
  {
    name: "Sam Johnson",
    age: 45,
    email: "sam@example.com",
    indicator: "danger",
  },
  {
    name: "",
    age: 29,
    email: "alice@example.com",
    indicator: "warning",
  },
  {
    name: "Bob White",
    age: 32,
    email: "bob@example.com",
    indicator: "info",
  },
  {
    name: "Charlie Black",
    age: 40,
    email: "charlie@example.com",
    indicator: "success",
  },
  {
    name: "Liu Wei",
    age: 30,
    email: "liu@example.com",
    indicator: "primary",
  },
  {
    name: "Aisha Khan",
    age: 27,
    email: "aisha@example.com",
    indicator: "secondary",
  },
  {
    name: "Carlos Garcia",
    age: 35,
    email: "carlos@example.com",
    indicator: "danger",
  },
  {
    name: "Fatima Zahra",
    age: 33,
    email: "fatima@example.com",
    indicator: "warning",
  },
  {
    name: "Emily Davis",
    age: 31,
    email: "emily@example.com",
    indicator: "info",
  },
  {
    name: "Michael Brown",
    age: 37,
    email: "michael@example.com",
    indicator: "success",
  },
  {
    name: "Olivia Wilson",
    age: 29,
    email: "olivia@example.com",
    indicator: "primary",
  },
  {
    name: "David Martinez",
    age: 42,
    email: "david@example.com",
    indicator: "secondary",
  },
  {
    name: "Sophia Anderson",
    age: 26,
    email: "sophia@example.com",
    indicator: "danger",
  },
  {
    name: "James Thompson",
    age: 38,
    email: "james@example.com",
    indicator: "warning",
  },
];

export const expandedData = [
  {
    name: "John Doe",
    age: 28,
    email: "john@example.com",
    indicator: "primary",
    children: [{ name: "John Jr.", age: 5, email: "johnjr@example.com" }],
  },
  {
    name: "Jane Smith",
    age: 34,
    email: "jane@example.com",
    indicator: "primary",
  },
  { name: "Sam Johnson", age: 45, email: "sam@example.com" },
  {
    name: "Alice Brown",
    age: 29,
    email: "alice@example.com",
    children: [{ name: "Alice Jr.", age: 3, email: "alicejr@example.com" }],
  },
  { name: "Bob White", age: 32, email: "bob@example.com" },
  { name: "Charlie Black", age: 40, email: "charlie@example.com" },
  { name: "Liu Wei", age: 30, email: "liu@example.com" },
  { name: "Aisha Khan", age: 27, email: "aisha@example.com" },
  { name: "Carlos Garcia", age: 35, email: "carlos@example.com" },
];

export const longData = (() => {
  const data = [];
  for (let i = 0; i < 15000; i++) {
    data.push({
      name: `Person ${i}`,
      age: Math.floor(Math.random() * 60) + 18, // Random age between 18 and 77
      email: `person${i}@example.com`,
      indicator: [
        "primary",
        "secondary",
        "danger",
        "warning",
        "info",
        "success",
      ][i % 6],
    });
  }
  return data;
})();
