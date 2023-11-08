import Button from "./components/button";

export function Dummy({ title }: { title: string }) {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      {title}
      <Button type={"button"}>
        <div>P</div>
      </Button>
    </div>
  );
}
