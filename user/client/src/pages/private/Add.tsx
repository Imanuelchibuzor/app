import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  FileText,
  ImageIcon,
  X,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for dropdowns
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
];

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Business",
  "Self-Help",
  "Technology",
  "Science",
  "History",
  "Biography",
  "Children",
  "Education",
  "Art & Design",
  "Health & Wellness",
];

interface FormData {
  title: string;
  author: string;
  language: string;
  category: string;
  pages: string;
  description: string;
  isRegistered: string;
  hasExplicitContent: string;
  pdfFile: File | null;
  coverImage: File | null;
  price: string;
  discount: string;
  enableDownloads: string;
  enableAffiliates: string;
  affiliateCommission: string;
}

export default function AddProductPage() {
  const [mode, setMode] = useState<"form" | "review">("form");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    language: "",
    category: "",
    pages: "",
    description: "",
    isRegistered: "no",
    hasExplicitContent: "no",
    pdfFile: null,
    coverImage: null,
    price: "",
    discount: "",
    enableDownloads: "yes",
    enableAffiliates: "yes",
    affiliateCommission: "",
  });

  const [pdfDragActive, setPdfDragActive] = useState(false);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePdfUpload = (file: File) => {
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, pdfFile: "Only PDF files are allowed" }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        pdfFile: "File size must be less than 10MB",
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, pdfFile: file }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.pdfFile;
      return newErrors;
    });
  };

  const handleImageUpload = (file: File) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        coverImage: "Only JPEG, JPG, and PNG files are allowed",
      }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        coverImage: "Image size must be less than 2MB",
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, coverImage: file }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.coverImage;
      return newErrors;
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setPdfDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePdfUpload(file);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImageDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author name is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.pages.trim()) newErrors.pages = "Number of pages is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.isRegistered === "yes")
      newErrors.isRegistered = "Registered products are currently not allowed";
    if (!formData.pdfFile) newErrors.pdfFile = "PDF file is required";
    if (!formData.coverImage) newErrors.coverImage = "Cover image is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (
      formData.enableAffiliates === "yes" &&
      !formData.affiliateCommission.trim()
    ) {
      newErrors.affiliateCommission = "Affiliate commission is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewProduct = () => {
    if (validateForm()) {
      setMode("review");
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submitting product:", formData);
    // Add your submission logic here
  };

  if (mode === "review") {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader className="text-center mb-4">
              <CardTitle className="text-2xl">Review Product</CardTitle>
              <CardDescription>
                Please review all product details before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Details */}
              <div className="grid gap-6 grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-muted-foreground">Title</h3>
                    <p className="mt-1 font-semibold">{formData.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      Author
                    </h3>
                    <p className="mt-1">{formData.author}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      Language
                    </h3>
                    <p className="mt-1">{formData.language}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      Category
                    </h3>
                    <p className="mt-1">{formData.category}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      Number of Pages
                    </h3>
                    <p className="mt-1">{formData.pages}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Price</h3>
                    <p className="mt-1 font-semibold">₦{formData.price}</p>
                  </div>
                  {formData.discount && (
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Discount
                      </h3>
                      <p className="mt-1">{formData.discount}%</p>
                    </div>
                  )}
                  {formData.discount && (
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        New Price
                      </h3>
                      <p className="mt-1">
                        ₦
                        {Math.round(
                          formData.price * (1 - formData.discount / 100)
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      Description
                    </h3>
                    <ScrollArea className="mt-1 h-50 leading-relaxed p-2 border rounded-md">
                      {formData.description}
                    </ScrollArea>
                  </div>

                  <div className="flex items-end gap-4">
                    {coverImagePreview && (
                      <img
                        src={coverImagePreview || "/placeholder.svg"}
                        alt="Product cover"
                        className="h-60 w-auto rounded-lg border-2 border-border object-cover shadow-lg"
                      />
                    )}

                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Product File
                      </h3>
                      <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formData.pdfFile?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  {formData.isRegistered === "yes" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {formData.isRegistered === "yes"
                      ? "Registered/Trademarked"
                      : "Not Registered"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.hasExplicitContent === "yes" ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  <span className="text-sm">
                    {formData.hasExplicitContent === "yes"
                      ? "Contains Explicit Content"
                      : "No Explicit Content"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.enableDownloads === "yes" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {formData.enableDownloads === "yes"
                      ? "Downloads Enabled"
                      : "Downloads Disabled"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.enableAffiliates === "yes" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {formData.enableAffiliates === "yes"
                      ? `Affiliates Enabled (${formData.affiliateCommission}% commission)`
                      : "Affiliates Disabled"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex pt-4 gap-3 justify-center">
                <Button variant="outline" onClick={() => setMode("form")}>
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={handleSubmit}>Submit Product</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Add New Product</CardTitle>
            <CardDescription>
              Fill in the details below to add a new product to your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter product title"
                  className={cn(errors.title && "border-destructive")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Author's Name */}
              <div className="space-y-2">
                <Label htmlFor="author">
                  Author's Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Enter author's name"
                  className={cn(errors.author && "border-destructive")}
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author}</p>
                )}
              </div>

              {/* Language, Category, and Number of pages */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="language">
                    Language <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      handleInputChange("language", value)
                    }
                  >
                    <SelectTrigger
                      id="language"
                      className={cn(errors.language && "border-destructive")}
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.language && (
                    <p className="text-sm text-destructive">
                      {errors.language}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className={cn(errors.category && "border-destructive")}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">
                    Number of Pages <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => handleInputChange("pages", e.target.value)}
                    placeholder="Enter number of pages"
                    className={cn(errors.pages && "border-destructive")}
                  />
                  {errors.pages && (
                    <p className="text-sm text-destructive">{errors.pages}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter product description"
                  rows={4}
                  className={cn(errors.description && "border-destructive")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Is Registered/Trademarked */}
              <div className="space-y-3">
                <Label>
                  Is this product registered or the content trademarked?{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.isRegistered}
                  onValueChange={(value) =>
                    handleInputChange("isRegistered", value)
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="registered-yes"
                      className={cn(
                        errors.isRegistered && "border-destructive"
                      )}
                    />
                    <Label htmlFor="registered-yes" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="registered-no" />
                    <Label htmlFor="registered-no" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.isRegistered && (
                  <p className="text-sm text-destructive">
                    {errors.isRegistered}
                  </p>
                )}
              </div>

              {/* Has Explicit Content */}
              <div className="space-y-3">
                <Label>
                  Does this product contain sexually explicit or harmful
                  content? <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.hasExplicitContent}
                  onValueChange={(value) =>
                    handleInputChange("hasExplicitContent", value)
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="explicit-yes" />
                    <Label htmlFor="explicit-yes" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="explicit-no" />
                    <Label htmlFor="explicit-no" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Upload PDF */}
              <div className="space-y-2">
                <Label>
                  Upload File - PDF Only (Max 10MB){" "}
                  <span className="text-destructive">*</span>
                </Label>
                {!formData.pdfFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setPdfDragActive(true);
                    }}
                    onDragLeave={() => setPdfDragActive(false)}
                    onDrop={handlePdfDrop}
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:bg-muted",
                      pdfDragActive && "border-primary bg-primary/5",
                      errors.pdfFile && "border-destructive"
                    )}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePdfUpload(file);
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PDF only (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm font-medium">
                          {formData.pdfFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, pdfFile: null }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {errors.pdfFile && (
                  <p className="text-sm text-destructive">{errors.pdfFile}</p>
                )}
              </div>

              {/* Upload Cover Image */}
              <div className="space-y-2">
                <Label>
                  Upload Cover Image (JPEG, JPG, PNG - Max 2MB){" "}
                  <span className="text-destructive">*</span>
                </Label>
                {!formData.coverImage ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setImageDragActive(true);
                    }}
                    onDragLeave={() => setImageDragActive(false)}
                    onDrop={handleImageDrop}
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:bg-muted",
                      imageDragActive && "border-primary bg-primary/5",
                      errors.coverImage && "border-destructive"
                    )}
                  >
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      JPEG, JPG, PNG (Max 2MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden flex justify-center rounded-lg border border-border">
                      {coverImagePreview && (
                        <img
                          src={coverImagePreview || "/placeholder.svg"}
                          alt="Cover preview"
                          className="h-48 object-cover"
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            coverImage: null,
                          }));
                          setCoverImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formData.coverImage.name} (
                      {(formData.coverImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
                {errors.coverImage && (
                  <p className="text-sm text-destructive">
                    {errors.coverImage}
                  </p>
                )}
              </div>

              {/* Price and Discount */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (₦) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className={cn(errors.price && "border-destructive")}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) =>
                      handleInputChange("discount", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Enable Downloads */}
              <div className="space-y-3">
                <Label>
                  Would you like to enable downloads for this product?{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.enableDownloads}
                  onValueChange={(value) =>
                    handleInputChange("enableDownloads", value)
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="downloads-yes" />
                    <Label htmlFor="downloads-yes" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="downloads-no" />
                    <Label htmlFor="downloads-no" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Enable Affiliates */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-3">
                  <Label>
                    Would you like affiliates to promote your product?{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.enableAffiliates}
                    onValueChange={(value) =>
                      handleInputChange("enableAffiliates", value)
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="affiliates-yes" />
                      <Label htmlFor="affiliates-yes" className="font-normal">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="affiliates-no" />
                      <Label htmlFor="affiliates-no" className="font-normal">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Affiliate Commission (Conditional) */}
                {formData.enableAffiliates === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="affiliateCommission">
                      Set Affiliates Commission (%){" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="affiliateCommission"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.affiliateCommission}
                      onChange={(e) =>
                        handleInputChange("affiliateCommission", e.target.value)
                      }
                      placeholder="Enter commission percentage"
                      className={cn(
                        errors.affiliateCommission && "border-destructive"
                      )}
                    />
                    {errors.affiliateCommission && (
                      <p className="text-sm text-destructive">
                        {errors.affiliateCommission}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Affiliate Commission (Conditional)
              {formData.enableAffiliates === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="affiliateCommission">
                    Set Affiliates Commission (%){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="affiliateCommission"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.affiliateCommission}
                    onChange={(e) =>
                      handleInputChange("affiliateCommission", e.target.value)
                    }
                    placeholder="Enter commission percentage"
                    className={cn(
                      errors.affiliateCommission && "border-destructive"
                    )}
                  />
                  {errors.affiliateCommission && (
                    <p className="text-sm text-destructive">
                      {errors.affiliateCommission}
                    </p>
                  )}
                </div>
              )} */}

              {/* Review Button */}
              <div className="flex justify-center pt-4">
                <Button type="button" onClick={handleReviewProduct} size="lg">
                  Review Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
