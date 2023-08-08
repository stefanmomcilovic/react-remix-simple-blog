export const meta = () => {
  return [
    { title: "Remix Blog" },
    { name: "description", content: "Welcome to Remix Blog!" },
  ];
};

export default function Index() {
  return (
    <h1>Hello world</h1>
  );
}
