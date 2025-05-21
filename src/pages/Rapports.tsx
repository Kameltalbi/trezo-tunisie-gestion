import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileSpreadsheet, FileText, Download, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Rapport } from "@/types/parametres";

// Mock data for reports
const mockRapports: Rapport[] = [
  {
    id: "1",
    type: "tresorerie",
    format: "pdf",
    dateDebut: "2025-01-01",
    dateFin: "2025-01-31"
  },
  {
    id: "2",
    type: "comptes",
    format: "excel",
    dateDebut: "2025-01-01",
    dateFin: "2025-03-31",
    filtre: {
      entite: "banqueA",
      categorie: "courant"
    }
  }
];

// Mock data for report options
const entitiesMock = [
  { id: "banqueA", name: "Banque ABC" },
  { id: "banqueB", name: "Banque XYZ" },
  { id: "caisse", name: "Caisse Principale" }
];

const categoriesMock = {
  tresorerie: ["Flux entrants", "Flux sortants", "Soldes"],
  comptes: ["courant", "epargne", "credit"],
  projets: ["actifs", "termines", "en_attente"],
  utilisateurs: ["admin", "collaborateur"]
};

const Rapports = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Rapport[]>(mockRapports);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [reportType, setReportType] = useState<"tresorerie" | "comptes" | "projets" | "utilisateurs">("tresorerie");
  const [reportFormat, setReportFormat] = useState<"pdf" | "excel">("pdf");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const getReportIcon = (format: "pdf" | "excel", size = 40) => {
    return format === "pdf" ? <FileText size={size} className="text-red-500" /> : <FileSpreadsheet size={size} className="text-green-600" />;
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "tresorerie":
        return t("rapports.treasury");
      case "comptes":
        return t("rapports.accounts");
      case "projets":
        return t("rapports.projects");
      case "utilisateurs":
        return t("rapports.users");
      default:
        return type;
    }
  };

  const handleGenerateReport = () => {
    // Validate
    if (!dateDebut || !dateFin) {
      toast.error(t("rapports.fill_all_fields"));
      return;
    }

    // Show generating state
    setIsGenerating(true);

    // Mock API call
    setTimeout(() => {
      // Create new report
      const newReport: Rapport = {
        id: Date.now().toString(),
        type: reportType,
        format: reportFormat,
        dateDebut,
        dateFin,
        filtre: {
          entite: selectedEntity || undefined,
          categorie: selectedCategory || undefined
        },
        url: `/mock-report-${Date.now()}.${reportFormat}`
      };

      // Add to state
      setReports([newReport, ...reports]);
      toast.success(t("rapports.success"));
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownload = (report: Rapport) => {
    toast.success(`${t("rapports.download")}: ${getReportTypeLabel(report.type)} (${report.format.toUpperCase()})`);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-1">{t("rapports.title")}</h1>
      <p className="text-muted-foreground mb-6">{t("rapports.description")}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Report generation form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("rapports.generate")}</CardTitle>
            <CardDescription>{t("rapports.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t("rapports.type")}</Label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("rapports.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tresorerie">{t("rapports.treasury")}</SelectItem>
                  <SelectItem value="comptes">{t("rapports.accounts")}</SelectItem>
                  <SelectItem value="projets">{t("rapports.projects")}</SelectItem>
                  <SelectItem value="utilisateurs">{t("rapports.users")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("rapports.format")}</Label>
              <RadioGroup 
                defaultValue="pdf" 
                className="flex gap-4"
                value={reportFormat}
                onValueChange={(value) => setReportFormat(value as "pdf" | "excel")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-red-500" />
                    {t("rapports.pdf")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                    {t("rapports.excel")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>{t("rapports.period")}</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date" className="text-xs text-muted-foreground">{t("rapports.start_date")}</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-xs text-muted-foreground">{t("rapports.end_date")}</Label>
                  <Input 
                    id="end-date" 
                    type="date" 
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters">
                <AccordionTrigger>{t("rapports.filters")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>{t("rapports.entity")}</Label>
                      <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("rapports.select_entity")} />
                        </SelectTrigger>
                        <SelectContent>
                          {entitiesMock.map((entity) => (
                            <SelectItem key={entity.id} value={entity.id}>
                              {entity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("rapports.category")}</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("rapports.select_category")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesMock[reportType]?.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? t("rapports.generating") : t("rapports.generate_report")}
            </Button>
          </CardFooter>
        </Card>

        {/* Generated reports list */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("rapports.title")}</h3>
          
          {reports.length > 0 ? (
            reports.map((report) => (
              <Card key={report.id} className="flex">
                <div className="p-4 flex items-center justify-center border-r">
                  {getReportIcon(report.format)}
                </div>
                <div className="p-4 flex-1">
                  <h4 className="font-medium">{getReportTypeLabel(report.type)}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(report.dateDebut).toLocaleDateString()} - {new Date(report.dateFin).toLocaleDateString()}
                  </p>
                  {report.filtre && Object.keys(report.filtre).length > 0 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {report.filtre.entite && <span className="mr-2">{report.filtre.entite}</span>}
                      {report.filtre.categorie && <span>{report.filtre.categorie}</span>}
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-center">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(report)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 border rounded-lg">
              <File className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">{t("rapports.no_data")}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rapports;
