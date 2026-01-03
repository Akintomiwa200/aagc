// components/devotional/FeaturedDevotional.tsx
'use client';

import { Calendar, Clock, Heart, Share2, BookOpen, ChevronLeft, ChevronRight, MessageCircle, Users, Target, MessageSquare, Bookmark, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BibleVersionSelector from './BibleVersionSelector';

interface Devotional {
  id: number;
  title: string;
  date: string;
  readingTime: string;
  scripture: string;
  content: string;
  reflection: string;
  application: string;
  prayer: string;
  author: string;
  authorRole: string;
  authorBio: string;
  category: string;
  tags: string[];
  bibleReference: {
    book: string;
    chapter: number;
    verse: number;
    endVerse?: number;
  };
}

export default function FeaturedDevotional() {
  const [currentDay, setCurrentDay] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(142);
  const [comments, setComments] = useState(28);
  const [shares, setShares] = useState(45);
  const [bibleText, setBibleText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('NIV');
  const router = useRouter();

  const devotionals: Devotional[] = [
    {
      id: 1,
      title: "Walking by Faith, Not by Sight",
      date: "February 20, 2024",
      readingTime: "6 min read",
      scripture: "2 Corinthians 5:7",
      content: "",
      reflection: `True faith requires us to look beyond our immediate circumstances and focus on God's eternal perspective. In a world that values what can be seen, measured, and proven, God calls us to a different standard. Faith is not blind optimism but confident assurance based on God's character and promises.\n\nWhen Paul wrote these words to the Corinthians, he was speaking to people facing persecution, doubt, and uncertainty. His message reminds us that our present difficulties are temporary, while God's promises are eternal. This perspective shift can transform how we face challenges, making us more resilient and hopeful.\n\nConsider the story of Abraham, who left everything familiar to follow God's call, not knowing where he was going. His faith wasn't based on a detailed plan but on trust in God's character. Similarly, our faith journey requires stepping into the unknown, trusting that God sees what we cannot and knows what we do not.`,
      application: `Today, take time to journal about one area where you're struggling to trust God. Write down your fears, then counter each with a promise from Scripture. Share this exercise with a trusted friend who can pray with you and hold you accountable in your faith journey.`,
      prayer: `Heavenly Father, in moments of doubt and uncertainty, strengthen my faith. Help me to see beyond my present circumstances and trust in Your eternal promises. When I'm tempted to rely only on what I can see, remind me of Your faithfulness throughout history and in my own life. Give me courage to take steps of faith, even when I don't see the full path ahead. In Jesus' name, Amen.`,
      author: "Pastor Michael Adebayo",
      authorRole: "Lead Pastor, Grace Community Church",
      authorBio: "With 15 years of pastoral experience, Michael specializes in faith development and spiritual formation.",
      category: "Faith & Trust",
      tags: ["Faith", "Trust", "Spiritual Growth", "Christian Living", "Perseverance"],
      bibleReference: {
        book: "2 Corinthians",
        chapter: 5,
        verse: 7
      }
    },
    {
      id: 2,
      title: "Trusting God in Uncertain Times",
      date: "February 21, 2024",
      readingTime: "5 min read",
      scripture: "Proverbs 3:5-6",
      content: "",
      reflection: `Trusting God completely requires surrendering our need for control and understanding. In an age of information overload, we're conditioned to analyze every situation, seek expert opinions, and develop contingency plans. While wisdom is valuable, Proverbs reminds us that true wisdom begins with trusting God more than our own understanding.\n\nThis passage presents a beautiful progression: trust leads to acknowledgment, which leads to guidance. When we trust God with our whole heart—not just the parts we're comfortable surrendering—we create space for Him to direct our paths. The Hebrew word for "straight" in this passage implies clearing obstacles and making the way passable.\n\nConsider Joseph's story: sold into slavery, falsely accused, and forgotten in prison. Yet at each stage, Scripture tells us "the Lord was with Joseph." His path wasn't straight by human standards, but God was making it straight according to His perfect plan. Our trust in God's guidance should remain firm, even when the path seems winding.`,
      application: `Create a "Trust List" of situations where you're trying to maintain control. Surrender each item through prayer, writing it down and symbolically placing it in a "God's Hands" box. Review this list weekly to acknowledge God's work in these areas.`,
      prayer: `Lord, I confess my tendency to trust my understanding more than Your wisdom. Today, I choose to surrender my plans, my timelines, and my need for clarity. Guide my steps according to Your perfect will. Give me peace in uncertainty and confidence in Your guidance. Help me to acknowledge You in every decision, big and small. Amen.`,
      author: "Dr. Sarah Johnson",
      authorRole: "Theologian & Author",
      authorBio: "Sarah holds a PhD in Biblical Studies and has written extensively on wisdom literature and spiritual formation.",
      category: "Wisdom & Guidance",
      tags: ["Wisdom", "Guidance", "Trust", "Surrender", "Providence"],
      bibleReference: {
        book: "Proverbs",
        chapter: 3,
        verse: 5,
        endVerse: 6
      }
    },
    {
      id: 3,
      title: "The Power of Persistent Prayer",
      date: "February 22, 2024",
      readingTime: "7 min read",
      scripture: "Luke 18:1-8",
      content: "",
      reflection: `Persistent prayer shapes both our circumstances and our character. Jesus' parable of the persistent widow teaches us that prayer isn't about changing God's mind but aligning our hearts with His will. The unjust judge represents human systems of power that are indifferent at best, while our Heavenly Father is compassionate and just.\n\nNotice that the widow's persistence wasn't passive waiting but active engagement. She kept coming, kept asking, kept believing justice would come. Her persistence changed the judge's response. Similarly, our persistent prayer changes us, deepening our dependence on God and strengthening our faith muscles.\n\nThe parable ends with a challenging question: "When the Son of Man comes, will he find faith on earth?" This connects persistent prayer with enduring faith. In a culture of instant gratification, persistent prayer teaches us to wait on God's timing, trust His justice, and remain faithful even when answers are delayed.`,
      application: `Start a 30-day prayer journal for one specific concern. Each day, write your prayer, any Scripture that comes to mind, and observations about your changing perspective. Invite a prayer partner to join you in this commitment.`,
      prayer: `Father, teach me to pray with the persistence of the widow. When answers seem delayed, strengthen my faith. When I feel unheard, remind me of Your attentive love. Help me to pray not just for outcomes but for transformed character. Make me a person of persistent faith, trusting in Your perfect timing and justice. In Jesus' name, Amen.`,
      author: "Rev. David Chen",
      authorRole: "Prayer Ministry Director",
      authorBio: "David leads international prayer initiatives and has trained thousands in developing a consistent prayer life.",
      category: "Prayer & Intercession",
      tags: ["Prayer", "Perseverance", "Faith", "Justice", "Spiritual Discipline"],
      bibleReference: {
        book: "Luke",
        chapter: 18,
        verse: 1,
        endVerse: 8
      }
    }
  ];

  const devotional = devotionals[currentDay];

  // Fetch Bible text from API
  useEffect(() => {
    const fetchBibleText = async () => {
      setIsLoading(true);
      try {
        const { book, chapter, verse, endVerse } = devotional.bibleReference;
        let url = `https://bible-api.com/${book}+${chapter}:${verse}`;
        if (endVerse) {
          url += `-${endVerse}`;
        }
        url += `?translation=${selectedVersion.toLowerCase()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setBibleText(data.text);
      } catch (error) {
        console.error('Error fetching Bible text:', error);
        setBibleText(devotional.content || 'Unable to load Scripture text.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBibleText();
  }, [currentDay, selectedVersion]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // In real app, save to user's bookmarks
  };

  const handleShare = () => {
    setShares(prev => prev + 1);
    navigator.clipboard.writeText(`${window.location.origin}/devotional/${devotional.id}`);
    alert('Link copied to clipboard!');
  };

  const handleReadComments = () => {
    router.push(`/devotional/${devotional.id}/comments`);
  };

  const handleViewAuthor = () => {
    router.push(`/author/${devotional.author.replace(/\s+/g, '-').toLowerCase()}`);
  };

  const handleDownloadPDF = () => {
    // Generate and download PDF
    alert('PDF download started!');
  };

  const goToPrevDay = () => {
    setCurrentDay(prev => (prev > 0 ? prev - 1 : devotionals.length - 1));
    setLiked(false);
  };

  const goToNextDay = () => {
    setCurrentDay(prev => (prev < devotionals.length - 1 ? prev + 1 : 0));
    setLiked(false);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/categories/${category.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 lg:p-8">
      <div className="lg:max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
         {/* Navigation Bar */}
<div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-700 px-6 py-4 shadow-md">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
    
    {/* Left: Previous / Next */}
    <div className="flex items-center gap-4 w-full sm:w-auto">
      
      {/* Previous Button */}
      <button 
        onClick={goToPrevDay}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium backdrop-blur-md shadow-sm transition-all hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Progress Indicator */}
      <div className="text-center flex-1 sm:flex-none px-2">
        <div className="text-white/90 text-sm font-medium mb-1">Daily Devotional</div>
        <div className="flex items-center justify-center gap-1 mb-1">
          {devotionals.map((_, idx) => (
            <div 
              key={idx}
              className={`transition-all duration-300 ${idx === currentDay ? 'w-8 h-2 bg-white rounded-full shadow-md' : 'w-2 h-2 bg-white/50 rounded-full'}`}
            ></div>
          ))}
        </div>
        <div className="text-white/80 text-xs">
          Day {currentDay + 1} of {devotionals.length}
        </div>
      </div>

      {/* Next Button */}
      <button 
        onClick={goToNextDay}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium backdrop-blur-md shadow-sm transition-all hover:scale-105 active:scale-95"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>

    {/* Right: PDF Download */}
    <div className="flex items-center gap-3">
      <button 
        onClick={handleDownloadPDF}
        className="flex items-center gap-2 px-4 py-2 bg-white/25 hover:bg-white/40 rounded-xl text-white text-sm font-medium backdrop-blur-md shadow-sm transition-all hover:scale-105 active:scale-95"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Save PDF</span>
      </button>
    </div>

  </div>
</div>


          {/* Main Content */}
          <div className="p-6 lg:p-8 space-y-8">
            {/* Header with Category */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => handleCategoryClick(devotional.category)}
                  className="px-4 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-full text-sm font-medium transition-colors cursor-pointer"
                >
                  {devotional.category}
                </button>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{devotional.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{devotional.readingTime}</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {devotional.title}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                {devotional.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-full text-xs font-medium transition-colors cursor-pointer"
                    onClick={() => router.push(`/tags/${tag.toLowerCase()}`)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Scripture Section with Version Selector */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 rounded-xl">
                    <BookOpen className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 text-xl">Today's Scripture</h3>
                    <p className="text-green-600">{devotional.scripture}</p>
                  </div>
                </div>
                
                <BibleVersionSelector 
                  selectedVersion={selectedVersion}
                  onVersionChange={setSelectedVersion}
                />
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-inner">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="mt-3 text-gray-600">Loading Scripture...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-800 text-xl italic leading-relaxed font-serif">
                      "{bibleText}"
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-green-700 font-bold">{devotional.scripture}</span>
                      <button 
                        onClick={() => router.push(`/bible/${devotional.bibleReference.book}/${devotional.bibleReference.chapter}`)}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        Read Full Chapter →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reflection Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Reflection</h3>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                {devotional.reflection.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 text-lg leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              
            </div>

            {/* Prayer Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageCircle className="h-7 w-7 text-blue-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Prayer Focus</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-gray-800 text-xl leading-relaxed italic text-center">
                    "{devotional.prayer}"
                  </p>
                </div>
                
                <button 
                  onClick={() => router.push('/prayer/wall')}
                  className="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all hover:shadow-lg flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Share Your Prayer</div>
                      <div className="text-sm text-blue-100">Our community will pray with you</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Interactive Stats & Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={handleLike}
                className="p-4 bg-gray-50 hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition-all group"
              >
                <div className="flex flex-col items-center">
                  <Heart className={`h-6 w-6 ${liked ? 'text-red-600 fill-red-600' : 'text-gray-600 group-hover:text-red-600'} transition-colors`} />
                  <span className="mt-2 font-medium">{likes}</span>
                  <span className="text-sm text-gray-500 group-hover:text-red-600">Likes</span>
                </div>
              </button>
              
              <button 
                onClick={handleBookmark}
                className="p-4 bg-gray-50 hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-all group"
              >
                <div className="flex flex-col items-center">
                  <Bookmark className={`h-6 w-6 ${bookmarked ? 'text-purple-600 fill-purple-600' : 'text-gray-600 group-hover:text-purple-600'} transition-colors`} />
                  <span className="mt-2 font-medium">Save</span>
                  <span className="text-sm text-gray-500 group-hover:text-purple-600">For later</span>
                </div>
              </button>
              
              <button 
                onClick={handleShare}
                className="p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-green-200 transition-all group"
              >
                <div className="flex flex-col items-center">
                  <Share2 className="h-6 w-6 text-gray-600 group-hover:text-green-600 transition-colors" />
                  <span className="mt-2 font-medium">{shares}</span>
                  <span className="text-sm text-gray-500 group-hover:text-green-600">Shares</span>
                </div>
              </button>
              
              <button 
                onClick={handleReadComments}
                className="p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-all group"
              >
                <div className="flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="mt-2 font-medium">{comments}</span>
                  <span className="text-sm text-gray-500 group-hover:text-blue-600">Comments</span>
                </div>
              </button>
            </div>

            {/* Author Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <button 
                    onClick={handleViewAuthor}
                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                  >
                    <span className="font-bold text-white text-2xl">
                      {devotional.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xl">{devotional.author}</h4>
                      <p className="text-gray-600">{devotional.authorRole}</p>
                    </div>
                    <button 
                      onClick={handleViewAuthor}
                      className="px-5 py-2.5 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      View Profile
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4">{devotional.authorBio}</p>
                  <button 
                    onClick={() => router.push(`/author/${devotional.author.replace(/\s+/g, '-').toLowerCase()}/devotionals`)}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                  >
                    View all devotionals by {devotional.author.split(' ')[0]} →
                  </button>
                </div>
              </div>
            </div>

            {/* Related Content */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 text-lg mb-4">Related Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => router.push('/devotionals/series/faith-journey')}
                  className="p-4 bg-white rounded-xl border border-green-200 hover:border-green-300 hover:shadow-sm transition-all text-left"
                >
                  <div className="text-green-600 font-medium text-sm mb-2">Series</div>
                  <div className="font-bold text-gray-900 mb-2">Faith Journey</div>
                  <div className="text-sm text-gray-600">5-part series on developing faith</div>
                </button>
                
                <button 
                  onClick={() => router.push('/resources/prayer-guide')}
                  className="p-4 bg-white rounded-xl border border-green-200 hover:border-green-300 hover:shadow-sm transition-all text-left"
                >
                  <div className="text-green-600 font-medium text-sm mb-2">Resource</div>
                  <div className="font-bold text-gray-900 mb-2">Prayer Guide</div>
                  <div className="text-sm text-gray-600">Learn different prayer methods</div>
                </button>
                
                <button 
                  onClick={() => router.push('/community/groups/bible-study')}
                  className="p-4 bg-white rounded-xl border border-green-200 hover:border-green-300 hover:shadow-sm transition-all text-left"
                >
                  <div className="text-green-600 font-medium text-sm mb-2">Community</div>
                  <div className="font-bold text-gray-900 mb-2">Bible Study Group</div>
                  <div className="text-sm text-gray-600">Join weekly discussions</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}