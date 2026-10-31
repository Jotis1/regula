// Jotis.me — window.Jotis. Types are documentation for consumers.
import type * as React from 'react';
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

export type IconName = string; // see window.Jotis.iconNames
export type StatusColor = 'gray' | 'brand' | 'error' | 'warning' | 'success';
export type BadgeColor = StatusColor | 'slate' | 'sky' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange';

export interface IconProps { name: IconName; size?: number; strokeWidth?: number; title?: string; spin?: boolean; className?: string; }
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hierarchy?: 'primary' | 'secondary' | 'tertiary' | 'link-color' | 'link-gray';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  destructive?: boolean; iconLeading?: IconName | ReactNode; iconTrailing?: IconName | ReactNode;
  iconOnly?: IconName; label?: string; loading?: boolean; href?: string; children?: ReactNode;
}
export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { label?: string; }
export interface ButtonGroupProps { items: { value: string; label?: ReactNode; icon?: IconName }[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; 'aria-label'?: string; }
export interface BadgeProps { color?: BadgeColor; type?: 'pill' | 'badge' | 'modern'; size?: 'sm' | 'md' | 'lg'; dot?: boolean; icon?: IconName; onRemove?: () => void; children: ReactNode; }
export interface TagProps { size?: 'sm' | 'md' | 'lg'; count?: number; dot?: boolean; onRemove?: () => void; children: ReactNode; }
export interface AvatarProps { src?: string; alt?: string; initials?: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'; status?: 'online' | 'offline'; ring?: boolean; }
export interface AvatarGroupProps { items: AvatarProps[]; size?: AvatarProps['size']; }
export interface AvatarLabelProps extends AvatarProps { name: ReactNode; supporting?: ReactNode; }
interface FieldProps { label?: ReactNode; required?: boolean; hint?: ReactNode; error?: string | boolean; }
export interface InputProps extends FieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> { size?: 'sm' | 'md' | 'lg'; icon?: IconName; trailing?: IconName; }
export interface TextareaProps extends FieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}
export interface SelectProps extends FieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> { options: (string | { value: string; label: ReactNode })[]; placeholder?: string; size?: 'sm' | 'md' | 'lg'; icon?: IconName; }
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> { label?: ReactNode; hint?: ReactNode; indeterminate?: boolean; size?: 'sm' | 'md'; }
export interface RadioProps extends CheckboxProps {}
export interface RadioGroupProps { options: { value: string; label: ReactNode; hint?: ReactNode }[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; size?: 'sm' | 'md'; name?: string; 'aria-label'?: string; }
export interface ToggleProps { label?: ReactNode; hint?: ReactNode; checked?: boolean; defaultChecked?: boolean; onChange?: (checked: boolean) => void; size?: 'sm' | 'md'; disabled?: boolean; }
export interface SliderProps { min?: number; max?: number; value?: number; defaultValue?: number; onChange?: (v: number) => void; 'aria-label'?: string; }
export interface ProgressBarProps { value: number; label?: 'right' | 'bottom' | false; 'aria-label'?: string; }
export interface TooltipProps { title: ReactNode; text?: ReactNode; open?: boolean; children: ReactNode; }
export interface FeaturedIconProps { icon?: IconName; color?: StatusColor; size?: 'sm' | 'md' | 'lg' | 'xl'; variant?: 'light' | 'modern' | 'outline'; }
export interface TabsProps { items: { id: string; label: ReactNode; count?: number }[]; value?: string; defaultValue?: string; onChange?: (id: string) => void; type?: 'underline' | 'button-brand' | 'button-gray' | 'button-border'; size?: 'sm' | 'md'; 'aria-label'?: string; }
export interface BreadcrumbsProps { items: { label: string; href?: string; icon?: IconName }[]; }
export interface PaginationProps { total: number; page?: number; defaultPage?: number; onChange?: (n: number) => void; }
export interface SidebarNavProps { brand?: ReactNode; search?: boolean; items: { icon?: IconName; label: ReactNode; href?: string; active?: boolean; badge?: ReactNode }[]; footerItems?: { icon?: IconName; label: ReactNode; href?: string }[]; user?: AvatarLabelProps; }
export interface DropdownProps { label?: ReactNode; trigger?: ReactNode; header?: ReactNode; open?: boolean; defaultOpen?: boolean; items: ({ icon?: IconName; label: ReactNode; shortcut?: string; danger?: boolean; onSelect?: () => void } | { divider: true })[]; }
export interface ModalProps { open?: boolean; title: ReactNode; description?: ReactNode; icon?: IconName; color?: StatusColor; iconVariant?: FeaturedIconProps['variant']; destructive?: boolean; layout?: 'stacked' | 'horizontal'; actions?: ReactNode; children?: ReactNode; onClose?: () => void; width?: number | string; contained?: boolean; }
export interface AlertProps { color?: StatusColor; title: ReactNode; description?: ReactNode; actions?: ReactNode; icon?: IconName; onClose?: () => void; variant?: 'floating' | 'full'; }
export interface NotificationProps extends AlertProps {}
export interface EmptyStateProps { icon?: IconName; title: ReactNode; description?: ReactNode; actions?: ReactNode; }
export interface TableColumn<R = any> { key: string; label: ReactNode; primary?: boolean; align?: 'left' | 'right'; render?: (row: R) => ReactNode; }
export interface TableProps<R = any> { columns: TableColumn<R>[]; rows: R[]; title?: ReactNode; count?: ReactNode; description?: ReactNode; actions?: ReactNode; footer?: ReactNode; size?: 'sm' | 'md'; }
export interface MetricCardProps { label: ReactNode; value: ReactNode; change?: ReactNode; trend?: 'up' | 'down'; period?: ReactNode; menu?: boolean; }
export interface PageHeaderProps { title: ReactNode; description?: ReactNode; breadcrumbs?: BreadcrumbsProps['items']; actions?: ReactNode; children?: ReactNode; divider?: boolean; }

export interface SpinnerProps { size?: 'sm' | 'md' | 'lg' | 'xl'; label?: ReactNode | false; }
export interface SkeletonProps { width?: number | string; height?: number | string; radius?: number | string; circle?: boolean; lines?: number; }
export interface DateRange { start: Date | null; end?: Date | null; }
export interface DatePickerProps { range?: boolean; defaultValue?: DateRange; onApply?: (v: DateRange) => void; presets?: { label: string; start: Date; end?: Date }[]; placeholder?: string; open?: boolean; defaultOpen?: boolean; inline?: boolean; today?: Date; }
export interface UploadFile { name: string; size?: number; progress?: number; status?: 'complete' | 'error'; error?: string; }
export interface FileUploadProps { accept?: string; multiple?: boolean; hint?: ReactNode; onFiles?: (files: File[]) => void; files?: UploadFile[]; onRemove?: (index: number) => void; disabled?: boolean; }
export interface FilterBarProps { segments?: ButtonGroupProps['items']; segmentValue?: string; defaultSegment?: string; onSegment?: (v: string) => void; search?: boolean; onSearch?: (q: string) => void; searchPlaceholder?: string; onOpenFilters?: () => void; activeFilters?: ({ label: string } | string)[]; onRemoveFilter?: (i: number) => void; onClear?: () => void; extra?: ReactNode; }
export interface SlideoutProps { open?: boolean; title: ReactNode; description?: ReactNode; children?: ReactNode; actions?: ReactNode; onClose?: () => void; width?: number | string; contained?: boolean; }
export interface CommandItem { icon?: IconName; label: string; description?: string; shortcut?: string; keywords?: string; onSelect?: () => void; }
export interface CommandMenuProps { open?: boolean; onClose?: () => void; groups: { label: string; items: CommandItem[] }[]; placeholder?: string; emptyText?: ReactNode; contained?: boolean; autoFocus?: boolean; }
export interface MessageProps { author?: ReactNode; avatar?: AvatarProps; time?: ReactNode; sent?: boolean; typing?: boolean; online?: boolean; footer?: ReactNode; children?: ReactNode; }
export interface MessageInputProps { placeholder?: string; onSend?: (text: string) => void; onAttach?: () => void; sendLabel?: string; disabled?: boolean; }
export interface CodeSnippetProps { code?: string; language?: string; tabs?: { label: string; code: string }[]; lineNumbers?: boolean; }

export interface CardHeaderProps { title: ReactNode; badge?: ReactNode; badgeColor?: BadgeColor; description?: ReactNode; actions?: ReactNode; menu?: boolean; onMenu?: () => void; avatar?: AvatarProps; }
export interface SectionHeaderProps { title: ReactNode; description?: ReactNode; actions?: ReactNode; size?: 'sm' | 'md'; divider?: boolean; children?: ReactNode; }
export interface SectionFooterProps { start?: ReactNode; actions?: ReactNode; card?: boolean; }
export interface ContentDividerProps { label?: ReactNode; heading?: boolean; variant?: 'single' | 'dual' | 'fill'; children?: ReactNode; }
export interface InlineCTAProps { title: ReactNode; description?: ReactNode; actions?: ReactNode; icon?: IconName; image?: string | ReactNode; imageAlt?: string; }
export interface ActivityItem { author: ReactNode; avatar?: AvatarProps; time?: ReactNode; text: ReactNode; content?: ReactNode; unread?: boolean; online?: boolean; }
export interface ActivityFeedProps { items: ActivityItem[]; connector?: boolean; size?: 'sm' | 'md'; }
export interface CalendarEvent { date: Date; title: string; time?: string; color?: BadgeColor; }
export interface CalendarViewProps { events?: CalendarEvent[]; today?: Date; month?: Date; maxEvents?: number; onSelectDate?: (d: Date) => void; subtitle?: ReactNode; actions?: ReactNode; }
export interface TreeItem { id: string; label: ReactNode; icon?: IconName; meta?: ReactNode; children?: TreeItem[]; }
export interface TreeViewProps { items: TreeItem[]; defaultOpen?: string[]; defaultSelected?: string; selected?: string; onSelect?: (item: TreeItem) => void; 'aria-label'?: string; }
export interface ChartSeries { name?: string; data: number[]; color?: string; }
export interface LineChartProps { labels: string[]; series: ChartSeries[]; format?: (v: number) => string; area?: boolean; legend?: boolean; width?: number; height?: number; 'aria-label'?: string; }
export interface BarChartProps { labels: string[]; series: ChartSeries[]; stacked?: boolean; format?: (v: number) => string; legend?: boolean; width?: number; height?: number; 'aria-label'?: string; }
export interface PieChartProps { data: { name: string; value: number; color?: string }[]; size?: number; hole?: number; center?: ReactNode; format?: (v: number) => string; legend?: boolean; 'aria-label'?: string; }
export interface ChartLegendProps { series: { name: string; color?: string }[]; vertical?: boolean; }
export interface ColorPickerProps { defaultValue?: string; onChange?: (hex: string) => void; swatches?: string[]; swatchesLabel?: string; }
export interface TextEditorProps { label?: ReactNode; defaultValue?: string; onChange?: (html: string) => void; placeholder?: string; maxLength?: number; hint?: ReactNode; minHeight?: number; disabled?: boolean; }
export interface VideoPlayerProps { src?: string; poster?: string; duration?: number; }

export interface BannerProps { title: ReactNode; description?: ReactNode; icon?: IconName; actions?: ReactNode; email?: { placeholder?: string; buttonLabel?: string; hint?: ReactNode; onSubmit?: (value: string) => void }; countdown?: Date; now?: Date; theme?: 'default' | 'brand'; layout?: 'floating' | 'full'; slim?: boolean; onClose?: () => void; 'aria-label'?: string; }
export interface BackgroundPatternProps { pattern?: 'grid' | 'grid-dot' | 'grid-check' | 'circles' | 'squares'; size?: 'sm' | 'md' | 'lg'; mask?: 'radial' | 'radial-down' | 'radial-up' | 'linear-down' | 'linear-up' | 'none'; width?: number; height?: number; seed?: number; className?: string; style?: React.CSSProperties; }
export interface CreditCardProps { theme?: 'brand-dark' | 'brand-light' | 'gray-dark' | 'gray-light' | 'transparent'; company?: ReactNode; holder?: string; expiry?: string; last4?: string; network?: ReactNode; className?: string; style?: React.CSSProperties; }
export type AppIconHue = 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose' | 'orange' | 'amber' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue';
export interface AppIconProps { app?: 'ornatus' | 'vinculum' | 'pecunia' | 'emptor'; letters?: string; hue?: AppIconHue; variant?: 'default' | 'solid' | 'light' | 'mono'; size?: number; shape?: 'rounded' | 'square'; tilde?: boolean; label?: string; className?: string; style?: React.CSSProperties; }
export interface BrowserFrameProps { variant?: 'safari' | 'minimal'; url?: string; height?: number | string; children?: ReactNode; className?: string; style?: React.CSSProperties; }
