import {
  AccessibleIcon,
  IconButton,
  Popover,
  Text,
} from "@itsmapleleaf/radix-themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const InfoIconPop = (props: { text: string }) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton variant="ghost" size="1" color="gray">
          <AccessibleIcon label="Prop description">
            <InfoCircledIcon />
          </AccessibleIcon>
        </IconButton>
      </Popover.Trigger>
      <Popover.Content
        side="top"
        align="center"
        style={{ maxWidth: 350 }}
        className="radix-themes-custom-fonts"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement)?.focus();
        }}
      >
        <Text as="div" size="2">
          {props.text}
        </Text>
      </Popover.Content>
    </Popover.Root>
  );
};
export default InfoIconPop;
