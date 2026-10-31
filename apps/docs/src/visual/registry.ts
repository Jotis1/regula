// Ejemplos para la paridad visual: cada uno reproduce la vista previa de la guía de su componente
// (reference/components/<Nombre>/preview.html) con los componentes de @jotis-me/react.
import type { ComponentType } from "react";
import { ButtonExample, ButtonGroupExample, CloseButtonExample, IconExample } from "./examples/actions";
import { AppIconExample } from "./examples/brand";
import { BarChartExample, ChartLegendExample, LineChartExample, PieChartExample } from "./examples/charts";
import {
	ActivityFeedExample,
	CalendarViewExample,
	CodeSnippetExample,
	MessageExample,
	MetricCardExample,
	TableExample,
} from "./examples/data";
import {
	AvatarExample,
	AvatarGroupExample,
	AvatarLabelExample,
	BadgeExample,
	TagExample,
} from "./examples/display";
import {
	FeaturedIconExample,
	ProgressBarExample,
	SkeletonExample,
	SpinnerExample,
} from "./examples/feedback";
import {
	CheckboxExample,
	ColorPickerExample,
	DatePickerExample,
	FileUploadExample,
	InputExample,
	MessageInputExample,
	RadioExample,
	RadioGroupExample,
	SelectExample,
	SliderExample,
	TextareaExample,
	TextEditorExample,
	ToggleExample,
} from "./examples/forms";
import {
	CardHeaderExample,
	ContentDividerExample,
	InlineCTAExample,
	PageHeaderExample,
	SectionFooterExample,
	SectionHeaderExample,
} from "./examples/layout";
import {
	BackgroundPatternExample,
	BrowserFrameExample,
	CreditCardExample,
	VideoPlayerExample,
} from "./examples/mockups";
import {
	BreadcrumbsExample,
	CommandMenuExample,
	DropdownExample,
	FilterBarExample,
	PaginationExample,
	SidebarNavExample,
	TabsExample,
	TreeViewExample,
} from "./examples/navigation";
import {
	AlertExample,
	BannerExample,
	EmptyStateExample,
	ModalExample,
	NotificationExample,
	SlideoutExample,
	TooltipExample,
} from "./examples/overlays";

export const visualExamples: Record<string, ComponentType> = {
	AppIcon: AppIconExample,
	FeaturedIcon: FeaturedIconExample,
	ProgressBar: ProgressBarExample,
	Skeleton: SkeletonExample,
	Spinner: SpinnerExample,
	Avatar: AvatarExample,
	AvatarGroup: AvatarGroupExample,
	AvatarLabel: AvatarLabelExample,
	Badge: BadgeExample,
	Tag: TagExample,
	Button: ButtonExample,
	ButtonGroup: ButtonGroupExample,
	CloseButton: CloseButtonExample,
	Icon: IconExample,
	Input: InputExample,
	Select: SelectExample,
	Textarea: TextareaExample,
	Checkbox: CheckboxExample,
	Radio: RadioExample,
	RadioGroup: RadioGroupExample,
	Toggle: ToggleExample,
	Slider: SliderExample,
	FileUpload: FileUploadExample,
	DatePicker: DatePickerExample,
	ColorPicker: ColorPickerExample,
	TextEditor: TextEditorExample,
	MessageInput: MessageInputExample,
	Tabs: TabsExample,
	Breadcrumbs: BreadcrumbsExample,
	Pagination: PaginationExample,
	SidebarNav: SidebarNavExample,
	Dropdown: DropdownExample,
	FilterBar: FilterBarExample,
	CommandMenu: CommandMenuExample,
	TreeView: TreeViewExample,
	Modal: ModalExample,
	Slideout: SlideoutExample,
	Tooltip: TooltipExample,
	Alert: AlertExample,
	Notification: NotificationExample,
	Banner: BannerExample,
	EmptyState: EmptyStateExample,
	Table: TableExample,
	MetricCard: MetricCardExample,
	ActivityFeed: ActivityFeedExample,
	Message: MessageExample,
	CalendarView: CalendarViewExample,
	CodeSnippet: CodeSnippetExample,
	PageHeader: PageHeaderExample,
	CardHeader: CardHeaderExample,
	SectionHeader: SectionHeaderExample,
	SectionFooter: SectionFooterExample,
	ContentDivider: ContentDividerExample,
	InlineCTA: InlineCTAExample,
	BackgroundPattern: BackgroundPatternExample,
	BrowserFrame: BrowserFrameExample,
	CreditCard: CreditCardExample,
	VideoPlayer: VideoPlayerExample,
	LineChart: LineChartExample,
	BarChart: BarChartExample,
	PieChart: PieChartExample,
	ChartLegend: ChartLegendExample,
};

/** `DatePicker` → `date-picker`. */
export const slugOf = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
