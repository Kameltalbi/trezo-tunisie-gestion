import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, FileText, Download, Plus, Filter, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Projet } from '@/types/projet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { addMonths } from 'date-fns';

// Mocked data for reports
const mockReports = [
  {
    id: '1',
    name: 'Rapport financier mensuel',
    type: 'financial',
    dateCreated: '2023-06-15',
    dateRange: { from: '2023-05-01', to: '2023-05-31' },
    format: 'pdf',
    status: 'completed',
  },
  {
    id: '2',
    name: 'Analyse des flux de trésorerie',
    type: 'cash_flow',
    dateCreated: '2023-06-10',
    dateRange: { from: '2023-01-01', to: '2023-05-31' },
    format: 'excel',
    status: 'completed',
  },
  {
    id: '3',
    name: 'Prévisions budgétaires',
    type: 'forecast',
    dateCreated: '2023-06-05',
    dateRange: { from: '2023-06-01', to: '2023-12-31' },
    format: 'pdf',
    status: 'scheduled',
  },
  {
    id: '4',
    name: 'Rapport de projet - Construction Immeuble A',
    type: 'project',
    dateCreated: '2023-05-20',
    dateRange: { from: '2023-01-15', to: '2023-05-15' },
    format: 'pdf',
    status: 'completed',
  },
];

const Rapports = () => {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addMonths(new Date(), 1),
  });
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'financial',
    format: 'pdf',
    description: '',
  });

  const handleCreateReport = () => {
    console.log('Creating report:', {
      ...newReport,
      dateRange,
    });
    setIsCreateDialogOpen(false);
    // In a real app, you would send this to your API
  };

  const handleDeleteReport = () => {
    console.log('Deleting report:', selectedReport);
    setIsDeleteDialogOpen(false);
    // In a real app, you would send this to your API
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'financial':
        return t('rapports.financial');
      case 'cash_flow':
        return t('rapports.cash_flow');
      case 'forecast':
        return t('rapports.forecast');
      case 'project':
        return t('rapports.project');
      default:
        return type;
    }
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {t('rapports.completed')}
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {t('rapports.scheduled')}
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {t('rapports.failed')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-2">{t('rapports.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('rapports.description')}</p>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {t('rapports.filter')}
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('rapports.all_types')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('rapports.all_types')}</SelectItem>
              <SelectItem value="financial">{t('rapports.financial')}</SelectItem>
              <SelectItem value="cash_flow">{t('rapports.cash_flow')}</SelectItem>
              <SelectItem value="forecast">{t('rapports.forecast')}</SelectItem>
              <SelectItem value="project">{t('rapports.project')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('rapports.create_report')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('rapports.create_new_report')}</DialogTitle>
              <DialogDescription>
                {t('rapports.create_report_description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="report-name">{t('rapports.report_name')}</Label>
                <Input
                  id="report-name"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('rapports.date_range')}</Label>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="report-type">{t('rapports.report_type')}</Label>
                  <Select
                    value={newReport.type}
                    onValueChange={(value) => setNewReport({ ...newReport, type: value })}
                  >
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder={t('rapports.select_type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">{t('rapports.financial')}</SelectItem>
                      <SelectItem value="cash_flow">{t('rapports.cash_flow')}</SelectItem>
                      <SelectItem value="forecast">{t('rapports.forecast')}</SelectItem>
                      <SelectItem value="project">{t('rapports.project')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="report-format">{t('rapports.format')}</Label>
                  <Select
                    value={newReport.format}
                    onValueChange={(value) => setNewReport({ ...newReport, format: value })}
                  >
                    <SelectTrigger id="report-format">
                      <SelectValue placeholder={t('rapports.select_format')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-description">{t('rapports.description')}</Label>
                <Textarea
                  id="report-description"
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('rapports.cancel')}
              </Button>
              <Button onClick={handleCreateReport}>{t('rapports.create')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('rapports.reports_list')}</CardTitle>
          <CardDescription>{t('rapports.manage_reports')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('rapports.name')}</TableHead>
                <TableHead>{t('rapports.type')}</TableHead>
                <TableHead>{t('rapports.date_created')}</TableHead>
                <TableHead>{t('rapports.period')}</TableHead>
                <TableHead>{t('rapports.format')}</TableHead>
                <TableHead>{t('rapports.status')}</TableHead>
                <TableHead className="text-right">{t('rapports.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-slate-500" />
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell>{getReportTypeLabel(report.type)}</TableCell>
                  <TableCell>
                    {format(new Date(report.dateCreated), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(report.dateRange.from), 'dd/MM/yyyy')} - {format(new Date(report.dateRange.to), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="uppercase">{report.format}</TableCell>
                  <TableCell>{getReportStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye size={16} className="mr-2" />
                          {t('rapports.view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download size={16} className="mr-2" />
                          {t('rapports.download')}
                        </DropdownMenuItem>
                        <AlertDialog open={isDeleteDialogOpen && selectedReport === report.id} onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open);
                          if (!open) setSelectedReport(null);
                        }}>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedReport(report.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              {t('rapports.delete')}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('rapports.delete_report')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('rapports.delete_report_confirm')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('rapports.cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteReport} className="bg-red-600 hover:bg-red-700">
                                {t('rapports.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('rapports.quick_reports')}</CardTitle>
            <CardDescription>{t('rapports.quick_reports_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-accent cursor-pointer">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                <span>{t('rapports.monthly_financial')}</span>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-accent cursor-pointer">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-green-600" />
                <span>{t('rapports.cash_flow_analysis')}</span>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-accent cursor-pointer">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-amber-600" />
                <span>{t('rapports.budget_forecast')}</span>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('rapports.scheduled_reports')}</CardTitle>
            <CardDescription>{t('rapports.scheduled_reports_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">{t('rapports.monthly_financial')}</p>
                <p className="text-sm text-muted-foreground">{t('rapports.every_month')}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {t('rapports.active')}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">{t('rapports.quarterly_report')}</p>
                <p className="text-sm text-muted-foreground">{t('rapports.every_quarter')}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {t('rapports.active')}
              </span>
            </div>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t('rapports.schedule_new_report')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rapports;
