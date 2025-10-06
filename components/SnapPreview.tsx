// Simplified snap preview component
import { Group, Rect, Text } from 'react-konva';
import { useCanvasStore } from '../lib/canvasStore';
import { TEXT_STYLES } from '../lib/constants/flightTheme';

export function SnapPreview() {
  const { snapTargetId, snapValid, blocks } = useCanvasStore();

  if (!snapTargetId) return null;

  const targetBlock = blocks.find(b => b.id === snapTargetId);
  if (!targetBlock) return null;

  const color = snapValid ? '#10b981' : '#ef4444'; // Green for valid, red for invalid

  return (
    <Group>
      {/* Simple snap zone highlight */}
      <Rect
        x={targetBlock.x - 10}
        y={targetBlock.y - 10}
        width={targetBlock.width + 20}
        height={targetBlock.height + 20}
        fill={color}
        opacity={0.2}
        stroke={color}
        strokeWidth={2}
        cornerRadius={8}
        dash={[5, 5]}
        listening={false}
      />
      
      {/* Simple status text */}
      <Text
        x={targetBlock.x + targetBlock.width / 2}
        y={targetBlock.y - 25}
        text={snapValid ? '✓ Can snap' : '✕ Timing conflict'}
        fontSize={TEXT_STYLES.sizes.legend}
        fontFamily={TEXT_STYLES.fontFamily}
        fill={color}
        fontStyle={TEXT_STYLES.weights.bold}
        align="center"
        listening={false}
      />
    </Group>
  );
}