import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Dimensions,
  PanResponder,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Clock,
  Bookmark,
  Share as ShareIcon,
  ChevronUp,
  ChevronDown,
  Briefcase,
  Heart,
} from "lucide-react-native";

const { height } = Dimensions.get("window");

const jobNewsData = [
  {
    id: 1,
    category: "Tech Jobs",
    title:
      "Google Announces 10,000 New AI Engineering Positions Across Global Offices",
    summary:
      "Tech giant Google is expanding its AI workforce with massive hiring drive focusing on machine learning engineers, data scientists, and AI researchers. The company plans to fill these positions by Q2 2025 with competitive salaries starting at $150,000.",
    readTime: "2 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=800&fit=crop",
    timestamp: "2 hours ago",
    likes: 1234,
    views: 15600,
  },
  {
    id: 2,
    category: "Remote Work",
    title:
      "Microsoft Shifts to Permanent Remote-First Policy for 80% of Roles",
    summary:
      "Microsoft announces major policy change allowing employees to work remotely permanently. The decision affects over 100,000 employees worldwide and includes roles in software development, marketing, and customer support with flexible location benefits.",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600&h=800&fit=crop",
    timestamp: "4 hours ago",
    likes: 892,
    views: 12300,
  },
  // ...rest of your news items
];

export default function JobNewsApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [likedItems, setLikedItems] = useState(new Set());

  const currentNews = jobNewsData[currentIndex];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dy < -50) {
          handleNext();
        } else if (gesture.dy > 50) {
          handlePrevious();
        }
      },
    })
  ).current;

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < jobNewsData.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : jobNewsData.length - 1
    );
  };

  const handleBookmark = () => {
    const updated = new Set(bookmarkedItems);
    if (updated.has(currentNews.id)) {
      updated.delete(currentNews.id);
    } else {
      updated.add(currentNews.id);
    }
    setBookmarkedItems(updated);
  };

  const handleLike = () => {
    const updated = new Set(likedItems);
    if (updated.has(currentNews.id)) {
      updated.delete(currentNews.id);
    } else {
      updated.add(currentNews.id);
    }
    setLikedItems(updated);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${currentNews.title}\n\n${currentNews.summary}`,
      });
    } catch (err) {
      await Clipboard.setStringAsync(
        `${currentNews.title}\n\n${currentNews.summary}`
      );
      Alert.alert("Copied to clipboard");
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Tech Jobs": "#3B82F6",
      "Remote Work": "#10B981",
      "Startup News": "#F59E0B",
      "Career Growth": "#8B5CF6",
      "Salary Trends": "#EF4444",
      "Job Market": "#06B6D4",
      "Skills Training": "#84CC16",
      Freelancing: "#EC4899",
    };
    return colors[category] || "#6B7280";
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ImageBackground
        source={{ uri: currentNews.imageUrl }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: "#3B82F6" },
              ]}
            >
              <Briefcase color="#fff" size={20} />
            </View>
            <View>
              <Text style={styles.headerTitle}>JobNews</Text>
              <Text style={styles.headerSubtitle}>
                {currentNews.timestamp}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.headerTitle}>
              {currentIndex + 1}/{jobNewsData.length}
            </Text>
            <Text style={styles.headerSubtitle}>
              {formatNumber(currentNews.views)} views
            </Text>
          </View>
        </View>

        {/* Category */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(currentNews.category) },
          ]}
        >
          <Text style={styles.categoryText}>
            {currentNews.category.toUpperCase()}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{currentNews.title}</Text>
          <Text style={styles.summary}>{currentNews.summary}</Text>

          {/* Meta */}
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Clock color="#fff" size={14} />
              <Text style={styles.metaText}>{currentNews.readTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Heart color="#fff" size={14} />
              <Text style={styles.metaText}>
                {formatNumber(currentNews.likes)} likes
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <View style={styles.actionLeft}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  likedItems.has(currentNews.id) && {
                    backgroundColor: "rgba(239,68,68,0.2)",
                  },
                ]}
                onPress={handleLike}
              >
                <Heart
                  color={
                    likedItems.has(currentNews.id) ? "#EF4444" : "#fff"
                  }
                  fill={
                    likedItems.has(currentNews.id) ? "#EF4444" : "none"
                  }
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  bookmarkedItems.has(currentNews.id) && {
                    backgroundColor: "rgba(234,179,8,0.2)",
                  },
                ]}
                onPress={handleBookmark}
              >
                <Bookmark
                  color={
                    bookmarkedItems.has(currentNews.id)
                      ? "#EAB308"
                      : "#fff"
                  }
                  fill={
                    bookmarkedItems.has(currentNews.id)
                      ? "#EAB308"
                      : "none"
                  }
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <ShareIcon color="#fff" size={20} />
              </TouchableOpacity>
            </View>

            {/* Navigation */}
            <View style={styles.navButtons}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevious}
              >
                <ChevronUp color="#fff" size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleNext}
              >
                <ChevronDown color="#fff" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: { flex: 1, justifyContent: "space-between" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 40,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  headerSubtitle: { color: "#ccc", fontSize: 12 },
  categoryBadge: {
    position: "absolute",
    top: 100,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  content: {
    padding: 16,
    paddingBottom: 32,
    justifyContent: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summary: { color: "#ddd", fontSize: 14, marginBottom: 12 },
  meta: { flexDirection: "row", marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  metaText: { color: "#fff", fontSize: 12, marginLeft: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionLeft: { flexDirection: "row", alignItems: "center" },
  actionButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 8,
  },
  navButtons: { alignItems: "center" },
  navButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 8,
  },
});


//.............................................................................................................................

// import React, { useState, useRef, useCallback } from "react";
// import {
//   View,
//   Text,
//   ImageBackground,
//   TouchableOpacity,
//   StyleSheet,
//   Share,
//   Alert,
//   Dimensions,
//   PanResponder,
//   Image,
// } from "react-native";
// import * as Clipboard from "expo-clipboard";
// import {
//   Clock,
//   Bookmark,
//   Share as ShareIcon,
//   ChevronUp,
//   ChevronDown,
//   Briefcase,
//   Heart,
// } from "lucide-react-native";

// const { height, width } = Dimensions.get("window");

// const jobNewsData = [
//   {
//     id: 1,
//     category: "Tech Jobs",
//     title:
//       "Google Announces 10,000 New AI Engineering Positions Across Global Offices",
//     summary:
//       "Tech giant Google is expanding its AI workforce with massive hiring drive focusing on machine learning engineers, data scientists, and AI researchers. The company plans to fill these positions by Q2 2025 with competitive salaries starting at $150,000.",
//     readTime: "2 min read",
//     imageUrl:
//       "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=800&fit=crop",
//     timestamp: "2 hours ago",
//     likes: 1234,
//     views: 15600,
//   },
//   {
//     id: 2,
//     category: "Remote Work",
//     title:
//       "Microsoft Shifts to Permanent Remote-First Policy for 80% of Roles",
//     summary:
//       "Microsoft announces major policy change allowing employees to work remotely permanently. The decision affects over 100,000 employees worldwide and includes roles in software development, marketing, and customer support with flexible location benefits.",
//     readTime: "3 min read",
//     imageUrl:
//       "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600&h=800&fit=crop",
//     timestamp: "4 hours ago",
//     likes: 892,
//     views: 12300,
//   },
//   // ...rest of your news items
// ];

// export default function JobNewsApp() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
//   const [likedItems, setLikedItems] = useState(new Set());

//   const currentNews = jobNewsData[currentIndex];

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderRelease: (e, gesture) => {
//         if (gesture.dy < -50) {
//           handleNext();
//         } else if (gesture.dy > 50) {
//           handlePrevious();
//         }
//       },
//     })
//   ).current;

//   const handleNext = () => {
//     setCurrentIndex((prev) =>
//       prev < jobNewsData.length - 1 ? prev + 1 : 0
//     );
//   };

//   const handlePrevious = () => {
//     setCurrentIndex((prev) =>
//       prev > 0 ? prev - 1 : jobNewsData.length - 1
//     );
//   };

//   const handleBookmark = () => {
//     const updated = new Set(bookmarkedItems);
//     if (updated.has(currentNews.id)) {
//       updated.delete(currentNews.id);
//     } else {
//       updated.add(currentNews.id);
//     }
//     setBookmarkedItems(updated);
//   };

//   const handleLike = () => {
//     const updated = new Set(likedItems);
//     if (updated.has(currentNews.id)) {
//       updated.delete(currentNews.id);
//     } else {
//       updated.add(currentNews.id);
//     }
//     setLikedItems(updated);
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `${currentNews.title}\n\n${currentNews.summary}`,
//       });
//     } catch (err) {
//       await Clipboard.setStringAsync(
//         `${currentNews.title}\n\n${currentNews.summary}`
//       );
//       Alert.alert("Copied to clipboard");
//     }
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       "Tech Jobs": "#87CEEB",
//       "Remote Work": "#ADD8E6",
//       "Startup News": "#B0E0E6",
//       "Career Growth": "#87CEFA",
//       "Salary Trends": "#87CEEB",
//       "Job Market": "#ADD8E6",
//       "Skills Training": "#B0E0E6",
//       Freelancing: "#87CEFA",
//     };
//     return colors[category] || "#87CEEB";
//   };

//   const formatNumber = (num) => {
//     if (num >= 1000) return (num / 1000).toFixed(1) + "K";
//     return num.toString();
//   };

//   return (
//     <View style={styles.container} {...panResponder.panHandlers}>
//       {/* Image Section - Top Half */}
//       <View style={styles.imageSection}>
//         <Image
//           source={{ uri: currentNews.imageUrl }}
//           style={styles.newsImage}
//           resizeMode="cover"
//         />
        
//         {/* Header overlay on image */}
//         <View style={styles.headerOverlay}>
//           <View style={styles.header}>
//             <View style={styles.headerLeft}>
//               <View style={styles.iconCircle}>
//                 <Briefcase color="#fff" size={20} />
//               </View>
//               <View>
//                 <Text style={styles.headerTitle}>JobNews</Text>
//                 <Text style={styles.headerSubtitle}>
//                   {currentNews.timestamp}
//                 </Text>
//               </View>
//             </View>
//             <View style={{ alignItems: "flex-end" }}>
//               <Text style={styles.headerTitle}>
//                 {currentIndex + 1}/{jobNewsData.length}
//               </Text>
//               <Text style={styles.headerSubtitle}>
//                 {formatNumber(currentNews.views)} views
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Category Badge */}
//         <View
//           style={[
//             styles.categoryBadge,
//             { backgroundColor: getCategoryColor(currentNews.category) },
//           ]}
//         >
//           <Text style={styles.categoryText}>
//             {currentNews.category.toUpperCase()}
//           </Text>
//         </View>
//       </View>

//       {/* Content Section - Bottom Half */}
//       <View style={styles.contentSection}>
//         <View style={styles.content}>
//           <Text style={styles.title}>{currentNews.title}</Text>
//           <Text style={styles.summary}>{currentNews.summary}</Text>

//           {/* Meta */}
//           <View style={styles.meta}>
//             <View style={styles.metaItem}>
//               <Clock color="#87CEEB" size={14} />
//               <Text style={styles.metaText}>{currentNews.readTime}</Text>
//             </View>
//             <View style={styles.metaItem}>
//               <Heart color="#87CEEB" size={14} />
//               <Text style={styles.metaText}>
//                 {formatNumber(currentNews.likes)} likes
//               </Text>
//             </View>
//           </View>

//           {/* Actions */}
//           <View style={styles.actions}>
//             <View style={styles.actionLeft}>
//               <TouchableOpacity
//                 style={[
//                   styles.actionButton,
//                   likedItems.has(currentNews.id) && styles.actionButtonActive,
//                 ]}
//                 onPress={handleLike}
//               >
//                 <Heart
//                   color={
//                     likedItems.has(currentNews.id) ? "#fff" : "#87CEEB"
//                   }
//                   fill={
//                     likedItems.has(currentNews.id) ? "#fff" : "none"
//                   }
//                   size={20}
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.actionButton,
//                   bookmarkedItems.has(currentNews.id) && styles.actionButtonActive,
//                 ]}
//                 onPress={handleBookmark}
//               >
//                 <Bookmark
//                   color={
//                     bookmarkedItems.has(currentNews.id)
//                       ? "#fff"
//                       : "#87CEEB"
//                   }
//                   fill={
//                     bookmarkedItems.has(currentNews.id)
//                       ? "#fff"
//                       : "none"
//                   }
//                   size={20}
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={handleShare}
//               >
//                 <ShareIcon color="#87CEEB" size={20} />
//               </TouchableOpacity>
//             </View>

//             {/* Navigation */}
//             <View style={styles.navButtons}>
//               <TouchableOpacity
//                 style={styles.navButton}
//                 onPress={handlePrevious}
//               >
//                 <ChevronUp color="#87CEEB" size={16} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.navButton}
//                 onPress={handleNext}
//               >
//                 <ChevronDown color="#87CEEB" size={16} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#fff" 
//   },
  
//   // Image Section Styles
//   imageSection: {
//     height: height * 0.5,
//     position: 'relative',
//   },
//   newsImage: {
//     width: '100%',
//     height: '100%',
//   },
//   headerOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     paddingTop: 40,
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: 'center',
//   },
//   headerLeft: { 
//     flexDirection: "row", 
//     alignItems: "center" 
//   },
//   iconCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#87CEEB",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   headerTitle: { 
//     color: "#fff", 
//     fontWeight: "bold", 
//     fontSize: 16 
//   },
//   headerSubtitle: { 
//     color: "#E6F3FF", 
//     fontSize: 12 
//   },
//   categoryBadge: {
//     position: "absolute",
//     bottom: 16,
//     left: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   categoryText: { 
//     color: "#fff", 
//     fontSize: 12, 
//     fontWeight: "600" 
//   },

//   // Content Section Styles
//   contentSection: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "space-between",
//   },
//   title: {
//     color: "#2C3E50",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 12,
//     lineHeight: 30,
//   },
//   summary: { 
//     color: "#5D6D7E", 
//     fontSize: 16, 
//     lineHeight: 22,
//     marginBottom: 16,
//     flex: 1,
//   },
//   meta: { 
//     flexDirection: "row", 
//     marginBottom: 20,
//   },
//   metaItem: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     marginRight: 20,
//   },
//   metaText: { 
//     color: "#87CEEB", 
//     fontSize: 14, 
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   actions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F8FF',
//   },
//   actionLeft: { 
//     flexDirection: "row", 
//     alignItems: "center" 
//   },
//   actionButton: {
//     padding: 12,
//     borderRadius: 25,
//     backgroundColor: "#F0F8FF",
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: '#E6F3FF',
//   },
//   actionButtonActive: {
//     backgroundColor: "#87CEEB",
//   },
//   navButtons: { 
//     alignItems: "center" 
//   },
//   navButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: "#F0F8FF",
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#E6F3FF',
//   },
// });