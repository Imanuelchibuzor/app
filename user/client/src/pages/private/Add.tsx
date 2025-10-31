import { useState } from "react";
import {
  Upload,
  FileText,
  ImageIcon,
  X,
  Pencil,
  EyeOff,
  Languages,
  BookOpen,
  Download,
  ShoppingCart,
  Loader2,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/reviews";
import languages from "../../data/language.json";
import categories from "../../data/categories.json";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import handleError from "@/utils/handleError";

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
  const { axios } = useAuth();

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
  const [loading, setLoading] = useState(false);

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
    if (Number(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (Number(formData.discount) < 0 || Number(formData.discount) > 100)
      newErrors.discount = "Discount is invalid";
    if (
      formData.enableAffiliates === "yes" &&
      !formData.affiliateCommission.trim()
    )
      newErrors.affiliateCommission = "Affiliate commission is required";
    if (
      formData.enableAffiliates === "yes" &&
      (Number(formData.affiliateCommission) < 0 ||
        Number(formData.affiliateCommission) > 100)
    )
      newErrors.affiliateCommission = "Affiliate commission is invalid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewProduct = () => {
    if (validateForm()) {
      setMode("review");
    }
  };

  const resetForm = () => {
    setFormData({
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
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("author", formData.author);
    submissionData.append("language", formData.language);
    submissionData.append("category", formData.category);
    submissionData.append("pages", formData.pages);
    submissionData.append("description", formData.description);
    submissionData.append("isRegistered", formData.isRegistered);
    submissionData.append("hasExplicitContent", formData.hasExplicitContent);
    submissionData.append("file", formData.pdfFile as File);
    submissionData.append("cover", formData.coverImage as File);
    submissionData.append("price", formData.price);
    submissionData.append("discount", formData.discount);
    submissionData.append("enableDownloads", formData.enableDownloads);
    submissionData.append("enableAffiliates", formData.enableAffiliates);
    submissionData.append("affiliateCommission", formData.affiliateCommission);

    try {
      const { data } = await axios.post("/pub/add", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);
        setMode("form");
        resetForm();
      } else toast.error(data.message);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (mode === "review") {
    return (
      <div className="min-h-screen">
        {/* Product Details Section */}
        <div className="container mx-auto px-2 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="overflow-hidden w-full max-w-md rounded-xl">
                <div className="relative aspect-[3/4] w-full">
                  <img
                    src={coverImagePreview as string}
                    alt={formData.title}
                    className="w-full object-cover"
                  />
                  {Number(formData.discount) > 0 && (
                    <Badge className="absolute top-4 right-4 bg-destructive">
                      -{formData.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">
                  {formData.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  by {formData.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  Category:{" "}
                  {categories[formData.category as keyof typeof categories]}
                </p>
              </div>

              {/* Rating */}
              <StarRating count={0} average={0} />

              {/* Description */}
              <ScrollArea className="max-h-[270px]">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {formData.description}
                </p>
              </ScrollArea>

              <Separator />

              {/* Product Details */}
              <div className="grid grid-cols-4 gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  <p className="font-medium">
                    {languages[formData.language as keyof typeof languages]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <p className="font-medium">{formData.pages}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  <p className="font-medium">
                    {formData.enableDownloads === "yes" ? "Yes" : "No"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="h-5 w-5" />
                  <p className="font-medium">
                    {formData.hasExplicitContent === "yes" ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Price and Buy Section */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    $
                    {Number(formData.price) -
                      (Number(formData.discount) / 100) *
                        Number(formData.price)}
                  </span>
                  {Number(formData.discount) > 0 && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${formData.price}
                    </span>
                  )}
                </div>

                <Button size="icon-lg" className="w-full gap-2">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Buy
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex pt-12 gap-6 justify-center">
            <Button variant="outline" onClick={() => setMode("form")}>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-2 sm:px-6 lg:px-8">
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
                      {Object.entries(languages).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
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
                      {Object.entries(categories).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
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
                  Does this product contain sexually explicit content?{" "}
                  <span className="text-destructive">*</span>
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
                    min={0}
                    max={100}
                    value={formData.discount}
                    onChange={(e) =>
                      handleInputChange("discount", e.target.value)
                    }
                    placeholder="0"
                    className={cn(errors.discount && "border-destructive")}
                  />
                  {errors.discount && (
                    <p className="text-sm text-destructive">
                      {errors.discount}
                    </p>
                  )}
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
