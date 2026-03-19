/**
 * Partner Project Creation/Edit Form
 *
 * Create or edit a project for fundraising.
 * Part 6 - Section 28: Partner Project Creation & Management
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { FOCUS_AREAS } from "@/types/partner";
import { httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import { db, functions } from "@/firebase";

const COUNTRIES = [
  "Netherlands",
  "Germany",
  "Belgium",
  "France",
  "United Kingdom",
  "Kenya",
  "Uganda",
  "Tanzania",
  "Ethiopia",
  "India",
  "Bangladesh",
];

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "clean_water",
    country: "",
    region: "",
    city: "",
    fundingGoal: "",
    currency: "EUR",
    startDate: "",
    endDate: "",
    targetBeneficiaries: "",
    coverImage: "",
  });

  useEffect(() => {
    if (!isEditing || !id) return;

    const loadProject = async () => {
      setIsLoadingProject(true);
      try {
        const projectRef = doc(db, "partnerProjects", id);
        const snap = await getDoc(projectRef);

        if (!snap.exists()) {
          toast.error("Project not found");
          navigate("/partner/projects");
          return;
        }

        const project = snap.data();
        setFormData({
          title: project.title ?? "",
          slug: project.slug ?? "",
          description: project.description ?? "",
          category: project.category ?? "clean_water",
          country: project.country ?? "",
          region: project.region ?? "",
          city: project.city ?? "",
          fundingGoal: project.fundingGoal ? String(project.fundingGoal) : "",
          currency: project.currency ?? "EUR",
          startDate: project.startDate ?? "",
          endDate: project.endDate ?? "",
          targetBeneficiaries: project.targetBeneficiaries
            ? String(project.targetBeneficiaries)
            : "",
          coverImage: project.coverImage ?? "",
        });
      } catch (error) {
        console.error("Failed to load project", error);
        toast.error("Failed to load project details");
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProject();
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const fundingGoal = Number(formData.fundingGoal);
    const targetBeneficiaries = formData.targetBeneficiaries
      ? Number(formData.targetBeneficiaries)
      : null;

    if (
      !formData.title ||
      !formData.description ||
      !formData.fundingGoal ||
      !formData.country
    ) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!Number.isFinite(fundingGoal) || fundingGoal <= 0) {
      toast.error("Funding goal must be a positive number");
      setIsSubmitting(false);
      return;
    }

    if (
      targetBeneficiaries !== null &&
      (!Number.isFinite(targetBeneficiaries) || targetBeneficiaries < 0)
    ) {
      toast.error("Target beneficiaries must be a valid positive number");
      setIsSubmitting(false);
      return;
    }

    try {
      const savePartnerProject = httpsCallable(functions, "savePartnerProject");

      await savePartnerProject({
        projectId: isEditing ? id : undefined,
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description,
        category: formData.category,
        country: formData.country,
        region: formData.region,
        city: formData.city,
        fundingGoal,
        currency: formData.currency,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        targetBeneficiaries: targetBeneficiaries ?? undefined,
        coverImage: formData.coverImage,
      });

      toast.success(
        isEditing
          ? "Project updated successfully!"
          : "Project created successfully!",
      );
      navigate("/partner/projects");
    } catch (error) {
      console.error("Failed to save project", error);
      toast.error("Failed to save project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/partner/projects")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? "Update your project details"
              : "Set up a new fundraising project"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: generateSlug(title),
                      });
                    }}
                    placeholder="e.g., Clean Water for Rural Kenya"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Project Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="clean-water-rural-kenya"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: gratis.org/projects/{formData.slug || "your-project"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your project, its goals, and impact..."
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FOCUS_AREAS.map((area) => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Project Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Region/State</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                      placeholder="e.g., Nairobi"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City/Village</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="e.g., Kibera"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funding */}
            <Card>
              <CardHeader>
                <CardTitle>Funding Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="fundingGoal">Funding Goal *</Label>
                    <Input
                      id="fundingGoal"
                      type="number"
                      min="0"
                      value={formData.fundingGoal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fundingGoal: e.target.value,
                        })
                      }
                      placeholder="50000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, currency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="targetBeneficiaries">
                    Target Beneficiaries
                  </Label>
                  <Input
                    id="targetBeneficiaries"
                    type="number"
                    min="0"
                    value={formData.targetBeneficiaries}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetBeneficiaries: e.target.value,
                      })
                    }
                    placeholder="1000"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    Recommended: 1200x800px, JPG or PNG
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isLoadingProject}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoadingProject
                    ? "Loading..."
                    : isSubmitting
                      ? "Saving..."
                      : isEditing
                        ? "Update Project"
                        : "Create Project"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/partner/projects")}
                >
                  Cancel
                </Button>

                {isEditing && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                  >
                    Delete Project
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-900 space-y-2">
                <p>• Use a clear, descriptive title</p>
                <p>• Include compelling photos</p>
                <p>• Set realistic funding goals</p>
                <p>• Provide regular updates</p>
                <p>• Engage with your donors</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
