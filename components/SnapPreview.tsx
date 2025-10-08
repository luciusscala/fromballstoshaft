// Simple, effective snap preview
import { Group, Rect, Text, Circle } from 'react-konva';
import { useCanvasStore } from '../lib/canvasStore';
import { TEXT_STYLES } from '../lib/constants/flightTheme';

export function SnapPreview() {
  const { snapPreview, blocks } = useCanvasStore();

  if (!snapPreview) return null;

  const targetBlock = blocks.find(b => b.id === snapPreview.targetBlockId);
  if (!targetBlock) return null;

  const color = snapPreview.shouldSnap ? '#10b981' : '#ef4444';
  const message = snapPreview.shouldSnap 
    ? `✓ Snap to ${snapPreview.snapType}` 
    : `✕ ${snapPreview.conflict || 'Cannot snap'}`;

  return (
    <Group>
      {/* Snap target outline */}
      <Rect
        x={targetBlock.x - 10}
        y={targetBlock.y - 10}
        width={targetBlock.width + 20}
        height={targetBlock.height + 20}
        stroke={color}
        strokeWidth={2}
        dash={[5, 5]}
        fill="transparent"
        cornerRadius={8}
        listening={false}
      />
      
      {/* Snap indicator dot */}
      <Circle
        x={targetBlock.x + targetBlock.width / 2}
        y={targetBlock.y + targetBlock.height / 2}
        radius={6}
        fill={color}
        stroke="white"
        strokeWidth={2}
        listening={false}
      />
      
      {/* Status message */}
      <Text
        x={targetBlock.x + targetBlock.width / 2}
        y={targetBlock.y - 25}
        text={message}
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