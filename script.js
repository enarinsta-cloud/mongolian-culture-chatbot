// DOMContentLoaded эвент нь хуудасны бүх HTML бүрэн ачаалагдаж дууссан үед ажиллана.
document.addEventListener('DOMContentLoaded', function() {
            // #chat-container id-тай элементийг авч chatContainer хувьсагчид хадгална.
            const chatContainer = document.getElementById('chat-container');
            // текст оруулах input талбар , Хэрэглэгчийн бичсэн мессежийг эндээс авна.
            const userInput = document.getElementById('user-input');
            // Хэрэглэгч мессеж бичээд энэ товчийг дарахад илгээнэ.
            const sendButton = document.getElementById('send-button');
            // Энэ нь “AI бичиж байна...” гэх мэт typing animation үзүүлэх хэсэг.
            const typingIndicator = document.getElementById('typing-indicator');
            // Эдгээр нь хэрэглэгчид урьдчилсан санал болгосон мессеж (Quick reply buttons)
            const suggestionBtns = document.querySelectorAll('.suggestion-btn');
            
            // 送信ボタンのクリックイベント Send товч дарвал мессеж илгээнэ.
            sendButton.addEventListener('click', sendMessage);
            
            // Enterキーで送信
            userInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // サジェスチョンボタンのイベント
            // .suggestion-btn гэсэн класстай бүх товчнууд дээр эвент нэмэж байна.
            // Хэрэглэгч эдгээр товчнуудын аль нэгийг дарвал: 
            // data-question атрибутын утгыг авч userInput (input талбар)-т оруулна.
            suggestionBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    userInput.value = this.getAttribute('data-question');
                    sendMessage();
                });
            });
            
            // モンゴル文化に関する知識ベース
            const mongolianKnowledge = {
                greetings: ["サイン・バイノ", "サイン・ウー", "Sain uu", " сайн байна уу"],
                foods: [
                    "ボーズ: 蒸し餃子のような料理で、羊肉と玉ねぎが入っています",
                    "ホーショール: 揚げたパンにひき肉を包んだもの",
                    "ツァイワン: 手延べ麺と野菜、肉の炒め物",
                    "スーテー・ツァイ: 塩入りミルクティー",
                    "アーロル: 乾燥したカード（乳製品）",
                    "アイラグ: 馬乳酒と呼ばれる発酵飲料"
                ],
                traditions: [
                    "ナーダム祭り: モンゴル最大の祭りで、相撲、競馬、弓術の3種目が行われます",
                    "ツァガーン・サル: モンゴルの正月で、白月節とも呼ばれます",
                    "ゲル: 移動式の住居で、遊牧民の伝統的な家です",
                    "ホーミー: 喉歌と呼ばれる独特の歌唱法",
                    "馬頭琴: モンゴルの伝統的な弦楽器で、馬の頭の形をした飾りがあります"
                ],
                history: [
                    "チンギス・ハン: 13世紀にモンゴル帝国を建国した偉大な指導者",
                    "モンゴル帝国: 世界史上最大の陸地を支配した帝国",
                    "フビライ・ハン: 元朝を建国したチンギス・ハンの孫",
                    "大元ウルス: モンゴル帝国の中国部分を支配した王朝"
                ],
                geography: [
                    "ウランバートル: モンゴルの首都で、世界で最も寒い首都の一つ",
                    "ゴビ砂漠: モンゴル南部に広がる巨大な砂漠",
                    "草原: モンゴルの大部分を占めるステップ地帯",
                    "アルタイ山脈: モンゴル西部に広がる山脈"
                ]
            };
            
            // 会話履歴を保存する配列 conversationHistory = чатны түүх хадгалах массив.
            let conversationHistory = [
                { role: "assistant", content: "サイン・バイノ（こんにちは）！モンゴルの文化、伝統、歴史についての質問にお答えします。どんなことが知りたいですか？" }
            ];

            // sendMessage функц нь хэрэглэгчийн бичсэн мессежийг илгээх үүрэгтэй.
            async function sendMessage() {
                const message = userInput.value.trim(); // trim() hooson zaig arilgana
                if (message === '') return;
                
                // ユーザーメッセージを追加 хэрэглэгчийн бичсэн мессежийг чат дэлгэц дээр харуулна.
                addMessage(message, 'user');
                conversationHistory.push({ role: "user", content: message }); //чатны түүхэнд "role": "user" мессеж нэмнэ.
                userInput.value = ''; // илгээсний дараа input талбарыг хоослоно.
                
                // タイピングインジケーターを表示
                typingIndicator.style.display = 'block'; // AI бичиж байгаа мэт (“typing...”) анимац гаргана.
                // чат доошоо автоматаар гүйлгэгдэнэ (хамгийн сүүлийн мессеж харагдаж байх).
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
                // aлдаа гарах магадлалтай кодыг хамгаалж байгаа хэсэг.
                try {
                    // モンゴル文化に関する応答を生成
                    const response = generateMongolianResponse(message);
                    
                    // タイピングインジケーターを非表示
                    typingIndicator.style.display = 'none'; // алдаа гарвал typingIndicator унтарна.
                    
                    // ボットの応答を追加
                    addMessage(response, 'bot');
                    conversationHistory.push({ role: "assistant", content: response });
                } catch (error) {
                    // タイピングインジケーターを非表示
                    typingIndicator.style.display = 'none';
                    
                    // エラーメッセージを表示
                    addMessage('申し訳ありません。現在接続に問題が発生しています。後ほど再度お試しください。', 'bot');
                    console.error('エラー:', error);
                }
            }
            
            function addMessage(text, sender) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.classList.add(sender + '-message');
                
                // bot iin design
                if (sender === 'bot') {
                    const headerDiv = document.createElement('div');
                    headerDiv.classList.add('message-header');
                    headerDiv.innerHTML = `
                        <div class="bot-icon">
                            <i class="fas fa-horse-head"></i>
                        </div>
                        <span>モンゴル文化アシスタント</span>
                    `;
                    messageDiv.appendChild(headerDiv);
                }
                // Хэрэглэгч эсвэл ботын бичсэн жирийн текст-ийг textNode болгон мессеж дотор нэмнэ.
                const textNode = document.createTextNode(text);
                messageDiv.appendChild(textNode);
                // чатын бүх мессеж хадгалагддаг хэсэг.
                chatContainer.insertBefore(messageDiv, typingIndicator);
                // чат доошоо автоматаар гүйлгэгдэнэ (хамгийн сүүлийн мессеж харагдана).
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            function generateMongolianResponse(userMessage) {
                // ユーザーのメッセージを小文字に変換して解析を容易にする
                // Хэрэглэгчийн бичсэн текстийг бүгдийг жижиг үсэг болгоно.
                // "食べ物" гэж бичсэн ч "食べ物ですか？" гэж бичсэн ч хайлт олдоно.
                const lowerCaseMessage = userMessage.toLowerCase();
                
                // モンゴル文化に関するキーワードに基づいた応答
                if (lowerCaseMessage.includes('食べ物') || lowerCaseMessage.includes('料理') || lowerCaseMessage.includes('食品')) {
                    return "モンゴルの伝統的な食べ物には以下のようなものがあります：\n" + 
                           mongolianKnowledge.foods.join("\n") + 
                           "\n\n特に羊肉と乳製品がモンゴル料理の中心です。";
                }
                
                if (lowerCaseMessage.includes('ナーダム') || lowerCaseMessage.includes('祭り') || lowerCaseMessage.includes('お祭り')) {
                    return "ナーダム祭りはモンゴル最大の祭りで、毎年7月11日から13日にかけて開催されます。\n" +
                           "この祭りでは『男の3競技』と呼ばれるモンゴル相撲、競馬、弓術が行われます。\n" +
                           "ナーダムは国中で祝われ、民族衣装を着た人々で賑わいます。";
                }
                
                if (lowerCaseMessage.includes('ゲル') || lowerCaseMessage.includes('住居') || lowerCaseMessage.includes('家')) {
                    return "ゲルはモンゴルの伝統的な移動式住居です。\n" +
                           "木製の骨組みにフェルトを被せて作られ、遊牧民の生活に適しています。\n" +
                           "ゲルは設営と解体が簡単で、季節ごとの移動に適しています。\n" +
                           "内部はとても機能的で、中央にストーブ、入口の反対側が客人用のエリアとなっています。";
                }
                
                if (lowerCaseMessage.includes('チンギス・ハン') || lowerCaseMessage.includes('成吉思汗') || lowerCaseMessage.includes('歴史')) {
                    return "チンギス・ハン（1162年-1227年）はモンゴル帝国の創設者です。\n" +
                           "彼は分散していたモンゴル部族を統一し、巨大な帝国を築きました。\n" +
                           "チンギス・ハンはモンゴルで英雄として崇拝されており、その肖像は紙幣や至る所で見られます。\n" +
                           "彼の生涯と業績は『元朝秘史』に詳しく記録されています。";
                }
                
                if (lowerCaseMessage.includes('馬頭琴') || lowerCaseMessage.includes('音楽') || lowerCaseMessage.includes('楽器')) {
                    return "馬頭琴（モリン・ホール）はモンゴルの伝統的な弦楽器です。\n" +
                           "その名の通り、楽器の首部分に馬の頭の彫刻が施されています。\n" +
                           "2本の弦を持ち、弓で演奏します。馬の嘶きや草原の風など、自然の音を表現するのが特徴です。\n" +
                           "2008年にはユネスコの無形文化遺産に登録されました。";
                }
                
                if (lowerCaseMessage.includes('遊牧民') || lowerCaseMessage.includes('遊牧')) {
                    return "モンゴルでは今でも人口の約3割が遊牧生活を営んでいます。\n" +
                           "遊牧民は季節ごとに移動し、羊、山羊、馬、牛、ラクダなどを飼育しています。\n" +
                           "遊牧生活は自然と調和した伝統的な生活様式で、ゲルに住み、家畜に依存した生活を送っています。\n" +
                           "近年では都市化の影響で遊牧民の数は減少傾向にあります。";
                }
                
                if (lowerCaseMessage.includes('挨拶') || lowerCaseMessage.includes('こんにちは') || lowerCaseMessage.includes('hello')) {
                    return "モンゴル語の挨拶：\n" +
                           "・サイン・バイノ（こんにちは）\n" +
                           "・バヤルタイ（おめでとう）\n" +
                           "・ツァアイン・ヤワラーイ（はじめまして）\n" +
                           "・バイヤルララー（ありがとう）\n" +
                           "モンゴルでは年長者や目上の人に対して敬意を表する挨拶が重要視されます。";
                }
                
                // デフォルトの応答
                const defaultResponses = [
                    "モンゴルについてもっと具体的に教えてください。食べ物、文化、歴史など何でもお答えします。",
                    "モンゴルは広大な草原と豊かな文化を持つ国です。何について知りたいですか？",
                    "モンゴルの文化について詳しくお話しできます。特定の質問をしていただけますか？",
                    "モンゴルについてのご質問ですね。伝統的な遊牧文化やチンギス・ハンの歴史など、どのようなことに関心がありますか？",
                    "サイン・バイノ！モンゴルはユニークな文化と長い歴史を持つ国です。何についてお聞きになりたいですか？"
                ];
                // keyword (түлхүүр үг) таараагүй үед санамсаргүй ерөнхий хариулт өгөх зориулалттай
                return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            }
        });