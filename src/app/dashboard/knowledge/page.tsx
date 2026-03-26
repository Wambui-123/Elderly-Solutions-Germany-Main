import { generateKnowledgeArticle, type KnowledgeArticleOutput } from '@/ai/flows/knowledge-hub-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const ArticleCard = ({ article }: { article: KnowledgeArticleOutput }) => (
    <Card className="flex flex-col">
        <CardHeader>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>{article.introduction}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {article.sections.map((section, index) => (
                <div key={index}>
                    <h3 className="font-semibold mb-2">{section.heading}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
                </div>
            ))}
        </CardContent>
    </Card>
);


export default async function KnowledgePage() {
    const topics = [
        "Simple exercises for maintaining mobility in seniors",
        "The importance of hydration for the elderly",
        "Tips for a healthy, balanced diet after 60"
    ];

    let articles: KnowledgeArticleOutput[] = [];
    try {
        articles = await Promise.all(
            topics.map(topic => generateKnowledgeArticle({ topic, language: 'en' }))
        );
    } catch (error) {
        console.error("Failed to generate knowledge articles:", error);
    }


    return (
        <div className="space-y-6">
            <div className="space-y-2">
                 <h1 className="font-headline text-3xl font-bold">Knowledge Hub</h1>
                 <p className="text-muted-foreground">Your center for in-depth information, research, and AI-powered insights.</p>
            </div>
           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     {articles.length > 0 ? (
                        articles.map((article, index) => <ArticleCard key={index} article={article} />)
                     ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Not Available</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">We're currently unable to load the AI-generated articles. This may be due to a missing API key. Please check your environment configuration.</p>
                            </CardContent>
                        </Card>
                     )}
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen />
                                Community Resources
                            </CardTitle>
                            <CardDescription>Browse articles and guides shared by the community.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Community resource linking will be implemented here.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
