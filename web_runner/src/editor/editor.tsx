export interface EditorProps {
  className?: string;
  content: string;
}

export function Editor(props: EditorProps) {
  return <div className={props.className} contentEditable={true}></div>;
}
