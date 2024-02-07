import { Button, IconButton } from "@radix-ui/themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function NavBar(props: any) {
  return (
    <div style={{ height: 32, display: "flex", padding: 5 }}>
      <div>NiceNode Impact Dashboard</div>
      <IconButton
        variant="ghost"
        size="1"
        color="gray"
        onClick={() => {
          props.onToggleTheme();
        }}
        style={{ marginLeft: "auto" }}
      >
        {props.theme === "light" ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </div>
  );
}
