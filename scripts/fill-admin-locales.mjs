// Fills missing admin translation keys in app/i18n/locales/{de,es,fr,it,ja,pt-BR}.json
// using en.json as the structural source of truth. Existing translations are kept.
// Usage: node scripts/fill-admin-locales.mjs
import fs from "node:fs";
import path from "node:path";

const dir = "app/i18n/locales";
const LANGS = ["de", "es", "fr", "it", "ja", "pt-BR"];

// [key, de, es, fr, it, ja, pt-BR]
const T = [
  ["preview.livePreview", "Live-Vorschau", "Vista previa en vivo", "Aperçu en direct", "Anteprima live", "ライブプレビュー", "Pré-visualização ao vivo"],
  ["preview.quickBuyPreview", "Quick-Buy-Vorschau", "Vista previa de compra rápida", "Aperçu Achat rapide", "Anteprima Acquisto rapido", "クイック購入のプレビュー", "Pré-visualização de compra rápida"],
  ["preview.barDrawerPreview", "Vorschau Leiste + Warenkorb-Drawer", "Vista previa de barra + panel del carrito", "Aperçu barre + panneau panier", "Anteprima barra + drawer del carrello", "バー＋カートドロワーのプレビュー", "Pré-visualização da barra + gaveta do carrinho"],
  ["preview.productPageMock", "Produktseiten-Mockup", "Maqueta de página de producto", "Maquette de page produit", "Mockup della pagina prodotto", "商品ページのモック", "Simulação da página de produto"],
  ["preview.nativeAddToCart", "Nativer „In den Warenkorb“-Button", "Añadir al carrito nativo", "Bouton Ajouter au panier natif", "Aggiungi al carrello nativo", "標準のカートに追加ボタン", "Adicionar ao carrinho nativo"],
  ["preview.checkout", "Kasse", "Pago", "Paiement", "Checkout", "チェックアウト", "Finalizar compra"],
  ["common.slim", "Schmal", "Delgado", "Fin", "Sottile", "スリム", "Fino"],
  ["common.tall", "Hoch", "Alto", "Haut", "Alto", "トール", "Alto"],
  ["common.active", "Aktiv", "Activo", "Actif", "Attivo", "有効", "Ativo"],
  ["common.disabled", "Deaktiviert", "Desactivado", "Désactivé", "Disattivato", "無効", "Desativado"],
  ["common.remove", "Entfernen", "Eliminar", "Supprimer", "Rimuovi", "削除", "Remover"],
  ["common.change", "Ändern", "Cambiar", "Modifier", "Cambia", "変更", "Alterar"],
  ["common.loading", "Wird geladen…", "Cargando…", "Chargement…", "Caricamento…", "読み込み中…", "Carregando…"],
  ["design.legendPopupBg", "Popup-Hintergrund", "Fondo del popup", "Arrière-plan de la popup", "Sfondo del popup", "ポップアップの背景", "Fundo do pop-up"],
  ["design.legendTitlePrice", "Titel & Preis", "Título y precio", "Titre et prix", "Titolo e prezzo", "タイトルと価格", "Título e preço"],
  ["design.legendButton", "Button", "Botón", "Bouton", "Pulsante", "ボタン", "Botão"],
  ["design.legendButtonText", "Button-Text", "Texto del botón", "Texte du bouton", "Testo del pulsante", "ボタンテキスト", "Texto do botão"],
  ["design.legendAccent", "Akzent", "Acento", "Accent", "Accento", "アクセント", "Destaque"],
  ["design.legendBorder", "Rahmen", "Borde", "Bordure", "Bordo", "枠線", "Borda"],
  ["design.themeTypography", "Theme-Typografie", "Tipografía del tema", "Typographie du thème", "Tipografia del tema", "テーマのタイポグラフィ", "Tipografia do tema"],
  ["design.themeTypographyHelp", "Standardmäßig werden Schriftart und Textfarbe des Shop-Themes verwendet. Deaktiviere diese Optionen, um unten eigene Werte zu erzwingen.", "Por defecto se usan la fuente y el color de texto del tema de la tienda. Desactívalos para forzar los valores personalizados de abajo.", "Par défaut, la police et la couleur du texte du thème de la boutique sont utilisées. Désactivez ces options pour imposer les valeurs personnalisées ci-dessous.", "Per impostazione predefinita vengono usati il font e il colore del testo del tema del negozio. Disattiva queste opzioni per forzare i valori personalizzati qui sotto.", "既定ではストアテーマのフォントとテキスト色を使用します。オフにすると、下のカスタム値が優先されます。", "Por padrão, usa a fonte e a cor do texto do tema da loja. Desative essas opções para forçar os valores personalizados abaixo."],
  ["design.resetColors", "Design-Farben zurücksetzen", "Restablecer colores del diseño", "Réinitialiser les couleurs du design", "Reimposta i colori del design", "デザインカラーをリセット", "Redefinir cores do design"],
  ["design.popupBarBg", "Popup- / Leistenhintergrund", "Fondo del popup / barra", "Arrière-plan de la popup / barre", "Sfondo del popup / barra", "ポップアップ／バーの背景", "Fundo do pop-up / barra"],
  ["design.titlePriceFallback", "Titel- & Preistext (eigener Fallback)", "Texto de título y precio (alternativa personalizada)", "Texte du titre et du prix (valeur de secours personnalisée)", "Testo di titolo e prezzo (fallback personalizzato)", "タイトルと価格のテキスト（カスタムのフォールバック）", "Texto de título e preço (alternativa personalizada)"],
  ["design.titlePrice", "Titel- & Preistext", "Texto de título y precio", "Texte du titre et du prix", "Testo di titolo e prezzo", "タイトルと価格のテキスト", "Texto de título e preço"],
  ["design.accentDrawer", "Akzentfarbe (Drawer-Hervorhebungen)", "Color de acento (resaltados del panel)", "Couleur d’accent (éléments mis en avant du panneau)", "Colore di accento (evidenziazioni del drawer)", "アクセントカラー（ドロワーのハイライト）", "Cor de destaque (realces da gaveta)"],
  ["design.borderColor", "Rahmenfarbe", "Color del borde", "Couleur de la bordure", "Colore del bordo", "枠線の色", "Cor da borda"],
  ["design.opacityPct", "Hintergrunddeckkraft %", "Opacidad del fondo %", "Opacité de l’arrière-plan %", "Opacità dello sfondo %", "背景の不透明度 %", "Opacidade do fundo %"],
  ["design.barRadius", "Eckenradius (Leiste)", "Radio de esquinas (barra)", "Rayon des coins (barre)", "Raggio degli angoli (barra)", "角の丸み（バー）", "Raio dos cantos (barra)"],
  ["design.buttonRadius", "Eckenradius des Buttons", "Radio de esquinas del botón", "Rayon des coins du bouton", "Raggio degli angoli del pulsante", "ボタンの角の丸み", "Raio dos cantos do botão"],
  ["header.titleHeading", "Titel", "Título", "Titre", "Titolo", "タイトル", "Título"],
  ["header.titleText", "Text ({{cart_quantity}} für die Artikelanzahl verwenden)", "Texto (usa {{cart_quantity}} para el número de artículos)", "Texte (utilisez {{cart_quantity}} pour le nombre d’articles)", "Testo (usa {{cart_quantity}} per il numero di articoli)", "テキスト（商品数には {{cart_quantity}} を使用）", "Texto (use {{cart_quantity}} para a quantidade de itens)"],
  ["header.alignSide", "Seite", "Lado", "Côté", "Lato", "配置側", "Lado"],
  ["header.closeHeading", "Schließen-Button", "Botón de cierre", "Bouton de fermeture", "Pulsante di chiusura", "閉じるボタン", "Botão de fechar"],
  ["display.barTitle", "Sticky-Leiste", "Barra fija", "Barre fixe", "Barra fissa", "スティッキーバー", "Barra fixa"],
  ["display.sliderTitle", "Warenkorb-Drawer", "Panel del carrito", "Panneau panier", "Drawer del carrello", "カートドロワー", "Gaveta do carrinho"],
  ["display.quickbuyTitle", "Quick Buy", "Compra rápida", "Achat rapide", "Acquisto rapido", "クイック購入", "Compra rápida"],
  ["display.barLayout", "Leistenlayout", "Diseño de la barra", "Disposition de la barre", "Layout della barra", "バーのレイアウト", "Layout da barra"],
  ["display.layoutRow", "Zeile", "Fila", "Ligne", "Riga", "横並び", "Linha"],
  ["display.layoutCompact", "Kompakte Pille", "Píldora compacta", "Pilule compacte", "Pillola compatta", "コンパクトなピル型", "Pílula compacta"],
  ["display.layoutStacked", "Gestapelt", "Apilado", "Empilé", "Impilato", "縦並び", "Empilhado"],
  ["display.barPosition", "Leistenposition", "Posición de la barra", "Position de la barre", "Posizione della barra", "バーの位置", "Posição da barra"],
  ["display.posBottom", "Unten Mitte", "Abajo al centro", "Bas centre", "In basso al centro", "下・中央", "Inferior central"],
  ["display.posBottomLeft", "Unten links", "Abajo a la izquierda", "Bas gauche", "In basso a sinistra", "下・左", "Inferior esquerda"],
  ["display.posBottomRight", "Unten rechts", "Abajo a la derecha", "Bas droite", "In basso a destra", "下・右", "Inferior direita"],
  ["display.posTop", "Oben Mitte", "Arriba al centro", "Haut centre", "In alto al centro", "上・中央", "Superior central"],
  ["display.posTopLeft", "Oben links", "Arriba a la izquierda", "Haut gauche", "In alto a sinistra", "上・左", "Superior esquerda"],
  ["display.posTopRight", "Oben rechts", "Arriba a la derecha", "Haut droite", "In alto a destra", "上・右", "Superior direita"],
  ["display.posLeft", "Mitte links", "Centro a la izquierda", "Milieu gauche", "Al centro a sinistra", "中央・左", "Meio à esquerda"],
  ["display.posRight", "Mitte rechts", "Centro a la derecha", "Milieu droite", "Al centro a destra", "中央・右", "Meio à direita"],
  ["display.imageShape", "Bildform", "Forma de la imagen", "Forme de l’image", "Forma dell’immagine", "画像の形状", "Formato da imagem"],
  ["display.shapeRounded", "Abgerundet", "Redondeado", "Arrondi", "Arrotondato", "角丸", "Arredondado"],
  ["display.shapeCircle", "Kreis", "Círculo", "Cercle", "Cerchio", "円形", "Círculo"],
  ["display.shapeSquare", "Quadrat", "Cuadrado", "Carré", "Quadrato", "正方形", "Quadrado"],
  ["display.buttonSize", "Button-Größe", "Tamaño del botón", "Taille du bouton", "Dimensione del pulsante", "ボタンサイズ", "Tamanho do botão"],
  ["display.sizeFull", "Volle Breite", "Ancho completo", "Pleine largeur", "Larghezza piena", "全幅", "Largura total"],
  ["announcements.disable", "Ankündigung deaktivieren", "Desactivar anuncio", "Désactiver l’annonce", "Disattiva annuncio", "お知らせを無効にする", "Desativar anúncio"],
  ["announcements.timerHelp", "Format MM:SS verwenden (Beispiel: 15:00). Füge {timer} in den Ankündigungstext ein, um den Countdown anzuzeigen.", "Usa el formato MM:SS (ejemplo: 15:00). Incluye {timer} en el texto del anuncio para mostrar la cuenta atrás.", "Utilisez le format MM:SS (exemple : 15:00). Ajoutez {timer} dans le texte de l’annonce pour afficher le compte à rebours.", "Usa il formato MM:SS (esempio: 15:00). Inserisci {timer} nel testo dell’annuncio per mostrare il conto alla rovescia.", "MM:SS 形式で入力してください（例：15:00）。お知らせのテキストに {timer} を入れると、カウントダウンが表示されます。", "Use o formato MM:SS (exemplo: 15:00). Inclua {timer} no texto do anúncio para exibir a contagem regressiva."],
  ["announcements.textPlaceholder", "Deine Produkte sind noch {timer} für dich reserviert!", "¡Tus productos están reservados durante {timer}!", "Vos produits sont réservés pendant {timer} !", "I tuoi prodotti sono riservati per {timer}!", "ご選択の商品は {timer} の間、確保されています！", "Seus produtos estão reservados por {timer}!"],
  ["rewards.disable", "Gestaffelte Belohnungen deaktivieren", "Desactivar recompensas por niveles", "Désactiver les récompenses par paliers", "Disattiva ricompense a livelli", "段階別特典を無効にする", "Desativar recompensas em níveis"],
  ["rewards.useTheme", "Theme-Farben verwenden", "Usar colores del tema", "Utiliser les couleurs du thème", "Usa i colori del tema", "テーマの色を使用", "Usar cores do tema"],
  ["rewards.resetColors", "Farben zurücksetzen", "Restablecer colores", "Réinitialiser les couleurs", "Reimposta i colori", "色をリセット", "Redefinir cores"],
  ["rewards.themeHelpOn", "Die Belohnungsleiste nutzt im Storefront die Akzent-/Vordergrund-Tokens des Themes.", "La franja de recompensas usa los tokens de acento y primer plano del tema en la tienda.", "La bande de récompenses utilise les jetons d’accent / de premier plan du thème sur la boutique.", "La striscia delle ricompense usa i token di accento / primo piano del tema sullo storefront.", "ストアフロントの特典バーには、テーマのアクセント／前景トークンが使われます。", "A faixa de recompensas usa os tokens de destaque / primeiro plano do tema na loja."],
  ["rewards.themeHelpOff", "Die unten gewählten eigenen Farben werden auf die Belohnungsleiste im Storefront angewendet.", "Los colores personalizados de abajo se aplican a la barra de recompensas en la tienda.", "Les couleurs personnalisées ci-dessous sont appliquées à la barre de récompenses sur la boutique.", "I colori personalizzati qui sotto vengono applicati alla barra delle ricompense sullo storefront.", "下のカスタムカラーがストアフロントの特典バーに適用されます。", "As cores personalizadas abaixo são aplicadas à barra de recompensas na loja."],
  ["rewards.livePreview", "Live-Farbvorschau", "Vista previa de color en vivo", "Aperçu des couleurs en direct", "Anteprima colori live", "カラーのライブプレビュー", "Pré-visualização de cores ao vivo"],
  ["rewards.legendBackground", "Hintergrund", "Fondo", "Arrière-plan", "Sfondo", "背景", "Fundo"],
  ["rewards.legendProgress", "Fortschritt", "Progreso", "Progression", "Avanzamento", "進捗", "Progresso"],
  ["rewards.legendIcon", "Symbol", "Icono", "Icône", "Icona", "アイコン", "Ícone"],
  ["rewards.legendText", "Text", "Texto", "Texte", "Testo", "テキスト", "Texto"],
  ["rewards.progressFg", "Fortschritt / Vordergrund", "Progreso / primer plano", "Progression / premier plan", "Avanzamento / primo piano", "進捗／前景", "Progresso / primeiro plano"],
  ["rewards.messageText", "Nachrichtentext", "Texto del mensaje", "Texte du message", "Testo del messaggio", "メッセージのテキスト", "Texto da mensagem"],
  ["rewards.iconColor", "Symbolfarbe", "Color del icono", "Couleur de l’icône", "Colore dell’icona", "アイコンの色", "Cor do ícone"],
  ["rewards.iconColorHelp", "Gilt für integrierte SVG-Symbole (PNG-Uploads behalten ihre eigenen Farben).", "Se aplica a los iconos SVG integrados (las imágenes PNG subidas conservan sus propios colores).", "S’applique aux icônes SVG intégrées (les PNG importés conservent leurs couleurs).", "Si applica alle icone SVG integrate (i PNG caricati mantengono i propri colori).", "内蔵の SVG アイコンに適用されます（アップロードした PNG は元の色のままです）。", "Aplica-se aos ícones SVG integrados (PNGs enviados mantêm suas próprias cores)."],
  ["rewards.barDesign", "Design der Fortschrittsleiste", "Diseño de la barra de progreso", "Design de la barre de progression", "Design della barra di avanzamento", "プログレスバーのデザイン", "Design da barra de progresso"],
  ["rewards.barDesignHelp", "Kombiniere Layout, Füllstil und Nachrichtenposition. Die Vorschau rechts aktualisiert sich – speichere, um im Storefront zu veröffentlichen.", "Combina diseño, estilo de relleno y posición del mensaje. La vista previa de la derecha se actualiza; guarda para publicar en la tienda.", "Combinez disposition, style de remplissage et position du message. L’aperçu à droite se met à jour ; enregistrez pour publier sur la boutique.", "Combina layout, stile di riempimento e posizione del messaggio. L’anteprima a destra si aggiorna: salva per pubblicare sullo storefront.", "レイアウト、塗りスタイル、メッセージ位置を組み合わせられます。右側のプレビューが更新されます。保存するとストアフロントに公開されます。", "Combine layout, estilo de preenchimento e posição da mensagem. A pré-visualização à direita é atualizada; salve para publicar na loja."],
  ["rewards.layoutStacked", "Leiste darunter", "Barra debajo", "Barre en dessous", "Barra sotto", "バーを下に配置", "Barra abaixo"],
  ["rewards.layoutStackedHint", "Meilensteine oben, Fortschrittsleiste darunter", "Hitos arriba, barra de progreso debajo", "Paliers au-dessus, barre de progression en dessous", "Traguardi in alto, barra di avanzamento sotto", "マイルストーンを上、プログレスバーを下に表示", "Marcos em cima, barra de progresso embaixo"],
  ["rewards.layoutMiddle", "Linie in der Mitte", "Línea en el centro", "Ligne au milieu", "Linea al centro", "中央にライン", "Linha no meio"],
  ["rewards.layoutMiddleHint", "Die Fortschrittslinie verläuft durch die Symbole", "La línea de progreso atraviesa los iconos", "La ligne de progression passe à travers les icônes", "La linea di avanzamento attraversa le icone", "進捗ラインがアイコンの中を通ります", "A linha de progresso passa pelos ícones"],
  ["rewards.fillStyle", "Füllstil des Fortschritts", "Estilo de relleno del progreso", "Style de remplissage de la progression", "Stile di riempimento dell’avanzamento", "進捗の塗りスタイル", "Estilo de preenchimento do progresso"],
  ["rewards.fillGradient", "Verlauf", "Degradado", "Dégradé", "Sfumatura", "グラデーション", "Gradiente"],
  ["rewards.fillSolid", "Einfarbig", "Sólido", "Uni", "Tinta unita", "単色", "Sólido"],
  ["rewards.fillStriped", "Gestreift", "Rayado", "Rayé", "A strisce", "ストライプ", "Listrado"],
  ["rewards.messagePosition", "Nachrichtenposition", "Posición del mensaje", "Position du message", "Posizione del messaggio", "メッセージの位置", "Posição da mensagem"],
  ["rewards.msgBelow", "Unter dem Fortschritt", "Debajo del progreso", "Sous la progression", "Sotto l’avanzamento", "進捗の下", "Abaixo do progresso"],
  ["rewards.msgAbove", "Über dem Fortschritt", "Encima del progreso", "Au-dessus de la progression", "Sopra l’avanzamento", "進捗の上", "Acima do progresso"],
  ["rewards.showIcons", "Meilenstein-Symbole anzeigen", "Mostrar iconos de hitos", "Afficher les icônes des paliers", "Mostra icone dei traguardi", "マイルストーンアイコンを表示", "Mostrar ícones dos marcos"],
  ["rewards.iconPosition", "Symbolposition", "Posición del icono", "Position de l’icône", "Posizione dell’icona", "アイコンの位置", "Posição do ícone"],
  ["rewards.iconPositionHelp", "Innen = auf der Fortschrittslinie. Außen = über oder unter der Leiste.", "Dentro = sobre la línea de progreso. Fuera = encima o debajo de la barra.", "Intérieur = sur la ligne de progression. Extérieur = au-dessus ou en dessous de la barre.", "Dentro = sulla linea di avanzamento. Fuori = sopra o sotto la barra.", "内側＝進捗ライン上。外側＝バーの上または下。", "Dentro = sobre a linha de progresso. Fora = acima ou abaixo da barra."],
  ["rewards.iconInside", "Innen (auf der Linie)", "Dentro (sobre la línea)", "À l’intérieur (sur la ligne)", "Dentro (sulla linea)", "内側（ライン上）", "Dentro (sobre a linha)"],
  ["rewards.iconOutsideTop", "Außen – oben", "Fuera: arriba", "Extérieur – haut", "Fuori – sopra", "外側 — 上", "Fora — acima"],
  ["rewards.iconOutsideBottom", "Außen – unten", "Fuera: abajo", "Extérieur – bas", "Fuori – sotto", "外側 — 下", "Fora — abaixo"],
  ["rewards.iconSize", "Symbolgröße (px)", "Tamaño del icono (px)", "Taille de l’icône (px)", "Dimensione dell’icona (px)", "アイコンサイズ（px）", "Tamanho do ícone (px)"],
  ["rewards.iconSizeHelp", "Durchmesser jedes Meilenstein-Kreises (14–48).", "Diámetro de cada círculo de hito (14–48).", "Diamètre de chaque cercle de palier (14–48).", "Diametro di ogni cerchio dei traguardi (14–48).", "各マイルストーン円の直径（14〜48）。", "Diâmetro de cada círculo de marco (14–48)."],
  ["rewards.iconStyle", "Symbolstil", "Estilo del icono", "Style de l’icône", "Stile dell’icona", "アイコンのスタイル", "Estilo do ícone"],
  ["rewards.styleFilled", "Gefüllt", "Relleno", "Plein", "Pieno", "塗りつぶし", "Preenchido"],
  ["rewards.styleOutline", "Umriss", "Contorno", "Contour", "Contorno", "アウトライン", "Contorno"],
  ["rewards.styleSoft", "Weich", "Suave", "Doux", "Morbido", "ソフト", "Suave"],
  ["rewards.stylePlain", "Schlicht", "Simple", "Simple", "Semplice", "シンプル", "Simples"],
  ["rewards.animation", "Belohnungsanimation", "Animación de recompensas", "Animation des récompenses", "Animazione delle ricompense", "特典のアニメーション", "Animação das recompensas"],
  ["rewards.animationHelp", "Bewegung der Fortschrittsleiste und beim Freischalten im Storefront", "Movimiento de la barra de progreso y del desbloqueo en la tienda", "Mouvement de la barre de progression et du déblocage sur la boutique", "Movimento della barra di avanzamento e dello sblocco sullo storefront", "ストアフロントでのプログレスバーとアンロック時の動き", "Movimento da barra de progresso e do desbloqueio na loja"],
  ["rewards.animSmooth", "Sanftes Füllen", "Relleno suave", "Remplissage fluide", "Riempimento fluido", "なめらかな塗り", "Preenchimento suave"],
  ["rewards.animPulse", "Puls beim Freischalten", "Pulso al desbloquear", "Pulsation au déblocage", "Pulsazione allo sblocco", "アンロック時にパルス", "Pulsar ao desbloquear"],
  ["rewards.animGlow", "Leuchtender Fortschritt", "Progreso brillante", "Progression lumineuse", "Avanzamento luminoso", "進捗を発光", "Progresso brilhante"],
  ["rewards.animBounce", "Hüpfende Meilensteine", "Hitos con rebote", "Paliers rebondissants", "Traguardi che rimbalzano", "マイルストーンをバウンド", "Marcos com efeito de salto"],
  ["rewards.tierN", "Stufe {n}", "Nivel {n}", "Palier {n}", "Livello {n}", "ティア {n}", "Nível {n}"],
  ["rewards.tabOff", " · aus", " · desactivado", " · désactivé", " · off", " · オフ", " · desativado"],
  ["rewards.tierEnabled", "Aktiviert", "Activado", "Activé", "Attivato", "有効", "Ativado"],
  ["rewards.rewardType", "Belohnungstyp", "Tipo de recompensa", "Type de récompense", "Tipo di ricompensa", "特典の種類", "Tipo de recompensa"],
  ["rewards.typeShipping", "Versand", "Envío", "Livraison", "Spedizione", "配送", "Frete"],
  ["rewards.typeDiscount", "Rabatt", "Descuento", "Réduction", "Sconto", "割引", "Desconto"],
  ["rewards.typeProduct", "Produkt", "Producto", "Produit", "Prodotto", "商品", "Produto"],
  ["rewards.typeCustom", "Benutzerdefiniert", "Personalizado", "Personnalisé", "Personalizzato", "カスタム", "Personalizado"],
  ["rewards.minQuantity", "Mindestmenge", "Cantidad mínima", "Quantité minimale", "Quantità minima", "最低数量", "Quantidade mínima"],
  ["rewards.minAmount", "Mindestbetrag", "Importe mínimo", "Montant minimum", "Importo minimo", "最低金額", "Valor mínimo"],
  ["rewards.tierDescription", "Belohnungsbeschreibung", "Descripción de la recompensa", "Description de la récompense", "Descrizione della ricompensa", "特典の説明", "Descrição da recompensa"],
  ["rewards.titleBefore", "Titel vor Erreichen ([AMOUNT] verwenden)", "Título antes de conseguirlo (usa [AMOUNT])", "Titre avant d’atteindre le palier (utilisez [AMOUNT])", "Titolo prima del raggiungimento (usa [AMOUNT])", "達成前のタイトル（[AMOUNT] を使用）", "Título antes de alcançar (use [AMOUNT])"],
  ["rewards.tierIcon", "Stufensymbol", "Icono del nivel", "Icône du palier", "Icona del livello", "ティアのアイコン", "Ícone do nível"],
  ["rewards.tierIconHelp", "Wähle ein integriertes Symbol oder ein Bild bzw. SVG aus Shopify-Dateien (nur für diese Stufe) aus oder lade es hoch.", "Elige un icono integrado o selecciona/sube una imagen o SVG desde Archivos de Shopify solo para este nivel.", "Choisissez une icône intégrée ou sélectionnez/importez une image ou un SVG depuis les Fichiers Shopify pour ce palier uniquement.", "Scegli un’icona integrata oppure seleziona/carica un’immagine o un SVG da File di Shopify solo per questo livello.", "内蔵アイコンを選ぶか、Shopify のファイルから画像または SVG を選択／アップロードします（このティアのみ）。", "Escolha um ícone integrado ou selecione/envie uma imagem ou SVG dos Arquivos do Shopify apenas para este nível."],
  ["rewards.preset.auto", "Automatisch (nach Typ)", "Auto (según el tipo)", "Auto (selon le type)", "Auto (in base al tipo)", "自動（種類に応じて）", "Automático (conforme o tipo)"],
  ["rewards.preset.truck", "Lieferwagen", "Camión", "Camion", "Camion", "トラック", "Caminhão"],
  ["rewards.preset.gift", "Geschenk", "Regalo", "Cadeau", "Regalo", "ギフト", "Presente"],
  ["rewards.preset.percent", "Prozent", "Porcentaje", "Pourcentage", "Percentuale", "パーセント", "Porcentagem"],
  ["rewards.preset.star", "Stern", "Estrella", "Étoile", "Stella", "スター", "Estrela"],
  ["rewards.preset.check", "Häkchen", "Marca de verificación", "Coche", "Spunta", "チェック", "Marca de seleção"],
  ["rewards.preset.heart", "Herz", "Corazón", "Cœur", "Cuore", "ハート", "Coração"],
  ["rewards.preset.lock", "Schloss", "Candado", "Cadenas", "Lucchetto", "ロック", "Cadeado"],
  ["rewards.preset.custom", "Shopify-Datei", "Archivo de Shopify", "Fichier Shopify", "File di Shopify", "Shopify ファイル", "Arquivo do Shopify"],
  ["rewards.customIcon", "Eigenes Symbol", "Icono personalizado", "Icône personnalisée", "Icona personalizzata", "カスタムアイコン", "Ícone personalizado"],
  ["rewards.changeFile", "Datei ändern", "Cambiar archivo", "Changer de fichier", "Cambia file", "ファイルを変更", "Alterar arquivo"],
  ["rewards.uploadFile", "+ Hochladen oder aus Shopify-Dateien wählen", "+ Subir o elegir de Archivos de Shopify", "+ Importer ou choisir depuis les Fichiers Shopify", "+ Carica o scegli da File di Shopify", "+ アップロードまたは Shopify ファイルから選択", "+ Enviar ou escolher dos Arquivos do Shopify"],
  ["rewards.pasteUrl", "Oder Bild-URL einfügen (PNG / SVG / JPG)", "O pega la URL de una imagen (PNG / SVG / JPG)", "Ou collez l’URL d’une image (PNG / SVG / JPG)", "Oppure incolla l’URL di un’immagine (PNG / SVG / JPG)", "または画像 URL を貼り付け（PNG / SVG / JPG）", "Ou cole o URL de uma imagem (PNG / SVG / JPG)"],
  ["rewards.pasteUrlHelp", "Nach dem Auswählen einer Datei oder dem Einfügen einer URL auf Speichern klicken, um im Storefront zu veröffentlichen.", "Tras elegir un archivo o pegar una URL, haz clic en Guardar para publicarlo en la tienda.", "Après avoir choisi un fichier ou collé une URL, cliquez sur Enregistrer pour publier sur la boutique.", "Dopo aver scelto un file o incollato un URL, fai clic su Salva per pubblicare sullo storefront.", "ファイルを選択するか URL を貼り付けたら、［保存］をクリックしてストアフロントに公開します。", "Depois de escolher um arquivo ou colar um URL, clique em Salvar para publicar na loja."],
  ["rewards.filesUnavailable", "Die Shopify-Dateiauswahl ist in dieser Admin-Sitzung nicht verfügbar. Aktualisiere das App-Embed bzw. App Bridge.", "El selector de Archivos de Shopify no está disponible en esta sesión de administración. Actualiza el embed de la app / App Bridge.", "Le sélecteur de Fichiers Shopify n’est pas disponible dans cette session d’administration. Mettez à jour l’intégration de l’app / App Bridge.", "Il selettore di File di Shopify non è disponibile in questa sessione di amministrazione. Aggiorna l’embed dell’app / App Bridge.", "この管理セッションでは Shopify ファイルのピッカーを利用できません。アプリ埋め込み／App Bridge を更新してください。", "O seletor de Arquivos do Shopify não está disponível nesta sessão de administração. Atualize o embed do app / App Bridge."],
  ["rewards.filesError", "Shopify-Dateien konnten nicht geöffnet werden. Authentifiziere die App nach der Scope-Aktualisierung erneut.", "No se pudo abrir Archivos de Shopify. Vuelve a autenticar la app tras actualizar los permisos.", "Impossible d’ouvrir les Fichiers Shopify. Réauthentifiez l’app après la mise à jour des autorisations.", "Impossibile aprire File di Shopify. Riautentica l’app dopo l’aggiornamento degli scope.", "Shopify ファイルを開けませんでした。スコープの更新後にアプリを再認証してください。", "Não foi possível abrir os Arquivos do Shopify. Autentique o app novamente após a atualização dos escopos."],
  ["rewards.productHeading", "Produkt", "Producto", "Produit", "Prodotto", "商品", "Produto"],
  ["rewards.productHelp", "Wähle ein Produkt für diesen Meilenstein. Nach dem Freischalten können Kunden es über die Belohnungsleiste öffnen.", "Elige un producto para este hito. Al desbloquearlo, los clientes podrán abrirlo desde la franja de recompensas.", "Choisissez un produit pour ce palier. Une fois débloqué, les clients pourront l’ouvrir depuis la bande de récompenses.", "Scegli un prodotto per questo traguardo. Una volta sbloccato, i clienti potranno aprirlo dalla striscia delle ricompense.", "このマイルストーンの商品を選択してください。アンロックされると、お客様は特典バーから商品を開けます。", "Escolha um produto para este marco. Quando desbloqueado, os clientes poderão abri-lo pela faixa de recompensas."],
  ["rewards.selectedProduct", "Ausgewähltes Produkt", "Producto seleccionado", "Produit sélectionné", "Prodotto selezionato", "選択中の商品", "Produto selecionado"],
  ["rewards.noUrl", "Keine URL", "Sin URL", "Aucune URL", "Nessun URL", "URL なし", "Sem URL"],
  ["rewards.addProduct", "+ Produkt hinzufügen", "+ Añadir producto", "+ Ajouter un produit", "+ Aggiungi prodotto", "+ 商品を追加", "+ Adicionar produto"],
  ["rewards.productTitleOverride", "Produkttitel (optional überschreiben)", "Título del producto (reemplazo opcional)", "Titre du produit (remplacement facultatif)", "Titolo del prodotto (sostituzione facoltativa)", "商品タイトル（任意で上書き）", "Título do produto (substituição opcional)"],
  ["rewards.productHandle", "Produkt-Handle", "Handle del producto", "Handle du produit", "Handle del prodotto", "商品ハンドル", "Handle do produto"],
  ["rewards.productHandleHelp", "z. B. free-gift – wird als /products/handle verwendet, wenn die URL leer ist", "p. ej. free-gift: se usa como /products/handle si la URL está vacía", "p. ex. free-gift – utilisé comme /products/handle si l’URL est vide", "ad es. free-gift – usato come /products/handle se l’URL è vuoto", "例：free-gift — URL が空の場合は /products/handle として使用されます", "p. ex. free-gift — usado como /products/handle se o URL estiver vazio"],
  ["rewards.productUrl", "Produkt-URL (optional)", "URL del producto (opcional)", "URL du produit (facultatif)", "URL del prodotto (facoltativo)", "商品 URL（任意）", "URL do produto (opcional)"],
  ["rewards.customHtml", "Eigenes Belohnungs-HTML", "HTML personalizado de recompensas", "HTML personnalisé des récompenses", "HTML personalizzato delle ricompense", "カスタム特典 HTML", "HTML personalizado das recompensas"],
  ["recommendations.disable", "Empfehlungen deaktivieren", "Desactivar recomendaciones", "Désactiver les recommandations", "Disattiva raccomandazioni", "おすすめを無効にする", "Desativar recomendações"],
  ["recommendations.help", "Zeige Produktempfehlungen, die Kunden mit einem Klick hinzufügen können – bei leerem Warenkorb und optional auch, wenn bereits Artikel im Warenkorb liegen.", "Muestra recomendaciones de productos que los clientes pueden añadir con un clic: en carritos vacíos y, opcionalmente, cuando ya hay artículos en el carrito.", "Affichez des recommandations de produits que les clients peuvent ajouter en un clic, sur les paniers vides et, en option, lorsque des articles sont déjà dans le panier.", "Mostra raccomandazioni di prodotti che i clienti possono aggiungere con un clic: sui carrelli vuoti e, facoltativamente, quando ci sono già articoli nel carrello.", "ワンクリックで追加できるおすすめ商品を表示します。カートが空のときに表示され、オプションで商品が入っているときにも表示できます。", "Exiba recomendações de produtos que os clientes podem adicionar com um clique, em carrinhos vazios e, opcionalmente, quando já há itens no carrinho."],
  ["recommendations.sourceProducts", "Bestimmte Produkte", "Productos específicos", "Produits spécifiques", "Prodotti specifici", "特定の商品", "Produtos específicos"],
  ["recommendations.collectionHandle", "Kollektions-Handle", "Handle de la colección", "Handle de la collection", "Handle della collezione", "コレクションハンドル", "Handle da coleção"],
  ["recommendations.collectionHandleHelp", "z. B. all, bestsellers – oder unten eine Kollektion auswählen", "p. ej. all, bestsellers, o elige una colección abajo", "p. ex. all, bestsellers – ou choisissez une collection ci-dessous", "ad es. all, bestsellers – oppure scegli una collezione qui sotto", "例：all、bestsellers — または下からコレクションを選択", "p. ex. all, bestsellers — ou escolha uma coleção abaixo"],
  ["recommendations.pickCollection", "Kollektion auswählen", "Elegir colección", "Choisir une collection", "Scegli collezione", "コレクションを選択", "Escolher coleção"],
  ["recommendations.productsSelected", "{count} Produkt(e) ausgewählt", "{count} producto(s) seleccionado(s)", "{count} produit(s) sélectionné(s)", "{count} prodotto/i selezionato/i", "{count} 件の商品を選択済み", "{count} produto(s) selecionado(s)"],
  ["recommendations.noneSelected", "Noch keine Produkte ausgewählt.", "Aún no hay productos seleccionados.", "Aucun produit sélectionné pour le moment.", "Nessun prodotto selezionato.", "商品がまだ選択されていません。", "Nenhum produto selecionado ainda."],
  ["recommendations.editProducts", "Produkte bearbeiten", "Editar productos", "Modifier les produits", "Modifica prodotti", "商品を編集", "Editar produtos"],
  ["recommendations.pickProducts", "Produkte auswählen", "Elegir productos", "Choisir des produits", "Scegli prodotti", "商品を選択", "Escolher produtos"],
  ["recommendations.animStagger", "Gestaffeltes Einblenden von unten", "Aparición escalonada hacia arriba", "Apparition échelonnée vers le haut", "Dissolvenza scalare verso l’alto", "時間差でフェードアップ", "Surgir em sequência de baixo para cima"],
  ["recommendations.animFade", "Einblenden", "Aparecer gradualmente", "Fondu", "Dissolvenza", "フェードイン", "Aparecer gradualmente"],
  ["recommendations.animSlide", "Hereingleiten", "Deslizar hacia dentro", "Glissement", "Scorrimento", "スライドイン", "Deslizar para dentro"],
  ["recommendations.shopNowHeading", "„Jetzt kaufen“-Button", "Botón «Comprar ahora»", "Bouton « Acheter maintenant »", "Pulsante «Acquista ora»", "「今すぐ購入」ボタン", "Botão «Comprar agora»"],
  ["discounts.help", "Beim Anwenden eines Codes werden Kunden über Shopifys Rabatt-URL geleitet und können danach zur Kasse zurückkehren.", "Al aplicar un código, los clientes pasan por la URL de descuento de Shopify y después pueden volver al pago.", "L’application d’un code redirige les clients via l’URL de réduction de Shopify, puis ils peuvent revenir au paiement.", "Applicando un codice, i clienti passano dall’URL di sconto di Shopify e poi possono tornare al checkout.", "コードを適用すると、お客様は Shopify の割引 URL を経由し、その後チェックアウトに戻れます。", "Ao aplicar um código, os clientes passam pelo URL de desconto do Shopify e depois podem voltar ao checkout."],
  ["cartSummary.openDrawerIfSupported", "Warenkorb-Drawer öffnen (falls unterstützt)", "Abrir panel del carrito (si es compatible)", "Ouvrir le panneau panier (si pris en charge)", "Apri drawer del carrello (se supportato)", "カートドロワーを開く（対応している場合）", "Abrir gaveta do carrinho (se compatível)"],
  ["cartSummary.tip", "Tipp: Stelle „Anzeigestil“ auf „Warenkorb-Drawer“ (erforderlich). „Warenkorb-Drawer öffnen“ öffnet dann den Drawer von Sticky ATC. Stelle außerdem den Warenkorbtyp des Themes auf „Seite“, damit das Header-Warenkorbsymbol nicht zu /cart springt.", "Consejo: configura Estilo de visualización → Panel del carrito (obligatorio). «Abrir panel del carrito» abrirá entonces el panel de Sticky ATC. Configura también el tipo de carrito del tema como Página para que el icono del carrito del encabezado no salte a /cart.", "Astuce : définissez Style d’affichage → Panneau panier (obligatoire). « Ouvrir le panneau panier » ouvre alors le panneau de Sticky ATC. Réglez aussi le type de panier du thème sur Page afin que l’icône panier de l’en-tête ne redirige pas vers /cart.", "Suggerimento: imposta Stile di visualizzazione → Drawer del carrello (obbligatorio). «Apri drawer del carrello» aprirà quindi il drawer di Sticky ATC. Imposta anche il tipo di carrello del tema su Pagina, così l’icona del carrello nell’header non porta a /cart.", "ヒント：表示スタイルを「カートドロワー」に設定してください（必須）。「カートドロワーを開く」で Sticky ATC のドロワーが開きます。また、ヘッダーのカートアイコンが /cart に遷移しないよう、テーマのカートタイプを「ページ」に設定してください。", "Dica: defina Estilo de exibição → Gaveta do carrinho (obrigatório). Assim, «Abrir gaveta do carrinho» abre a gaveta do Sticky ATC. Defina também o tipo de carrinho do tema como Página para que o ícone do carrinho no cabeçalho não leve a /cart."],
  ["cartSummary.customTemplate", "Eigene Fußzeilen-/Checkout-Vorlage", "Plantilla personalizada de pie de página / pago", "Modèle personnalisé de pied de page / paiement", "Template personalizzato per footer / checkout", "カスタムのフッター／チェックアウトテンプレート", "Modelo personalizado de rodapé / checkout"],
  ["templates.intro", "Eigenes HTML / CSS / JS pro Warenkorb-Drawer-Funktion. Die Editoren sind zunächst leer – nutze die Tabs unten zum Bearbeiten. Mustache: {{name}} (maskiert) und {{{html}}} (roh).", "HTML / CSS / JS personalizado para cada función del panel del carrito. Los editores empiezan vacíos: usa las pestañas de abajo para editar. Mustache: {{name}} (escapado) y {{{html}}} (sin escapar).", "HTML / CSS / JS personnalisé pour chaque fonctionnalité du panneau panier. Les éditeurs sont vides au départ : utilisez les onglets ci-dessous pour modifier. Mustache : {{name}} (échappé) et {{{html}}} (brut).", "HTML / CSS / JS personalizzato per ogni funzione del drawer del carrello. Gli editor partono vuoti: usa le schede qui sotto per modificare. Mustache: {{name}} (con escape) e {{{html}}} (grezzo).", "カートドロワーの機能ごとにカスタム HTML / CSS / JS を設定できます。エディターは空の状態から始まります。下のタブで編集してください。Mustache：{{name}}（エスケープ）、{{{html}}}（そのまま出力）。", "HTML / CSS / JS personalizado para cada recurso da gaveta do carrinho. Os editores começam vazios; use as abas abaixo para editar. Mustache: {{name}} (com escape) e {{{html}}} (bruto)."],
  ["templates.globalCss", "Globales Drawer-CSS", "CSS global del panel", "CSS global du panneau", "CSS globale del drawer", "ドロワーのグローバル CSS", "CSS global da gaveta"],
  ["templates.globalCssPlaceholder", "Globales CSS hier eingeben… z. B. .satc-slider__panel { }", "Escribe aquí el CSS global… p. ej. .satc-slider__panel { }", "Saisissez ici le CSS global… p. ex. .satc-slider__panel { }", "Scrivi qui il CSS globale… ad es. .satc-slider__panel { }", "グローバル CSS をここに入力… 例：.satc-slider__panel { }", "Digite o CSS global aqui… p. ex. .satc-slider__panel { }"],
  ["templates.featureTemplates", "Funktionsvorlagen", "Plantillas de funciones", "Modèles de fonctionnalités", "Template delle funzioni", "機能テンプレート", "Modelos de recursos"],
  ["pages.stickyShowOn", "Sticky-Leiste – anzeigen auf", "Barra fija: mostrar en", "Barre fixe – afficher sur", "Barra fissa – mostra su", "スティッキーバー — 表示する場所", "Barra fixa — exibir em"],
  ["pages.drawerShowOn", "Warenkorb-Drawer – anzeigen auf", "Panel del carrito: mostrar en", "Panneau panier – afficher sur", "Drawer del carrello – mostra su", "カートドロワー — 表示する場所", "Gaveta do carrinho — exibir em"],
  ["pages.drawerHelp", "Unabhängig von der Sticky-Leiste. Legt fest, wo sich der Warenkorb-Drawer öffnen kann (auch über das Warenkorbsymbol im Header).", "Independiente de la barra fija. Controla dónde puede abrirse el panel del carrito (incluido el icono del carrito del encabezado).", "Indépendant de la barre fixe. Définit où le panneau panier peut s’ouvrir (y compris depuis l’icône panier de l’en-tête).", "Indipendente dalla barra fissa. Controlla dove può aprirsi il drawer del carrello (inclusa l’icona del carrello nell’header).", "スティッキーバーとは独立した設定です。カートドロワーを開ける場所（ヘッダーのカートアイコンを含む）を制御します。", "Independente da barra fixa. Controla onde a gaveta do carrinho pode abrir (inclusive pelo ícone do carrinho no cabeçalho)."],
  ["behavior.drawerAnimHelp", "Bewegung beim Öffnen und Schließen des Warenkorb-Drawers", "Movimiento al abrir y cerrar el panel del carrito", "Animation à l’ouverture et à la fermeture du panneau panier", "Movimento all’apertura e alla chiusura del drawer del carrello", "カートドロワーを開閉するときの動き", "Movimento ao abrir e fechar a gaveta do carrinho"],
  ["behavior.animSlide", "Gleiten", "Deslizar", "Glissement", "Scorrimento", "スライド", "Deslizar"],
  ["behavior.animFade", "Einblenden", "Fundido", "Fondu", "Dissolvenza", "フェード", "Esmaecer"],
  ["behavior.animScale", "Skalieren", "Escala", "Zoom", "Scala", "スケール", "Escala"],
  ["behavior.edgeOffset", "Randabstand (px)", "Desplazamiento del borde (px)", "Décalage du bord (px)", "Distanza dal bordo (px)", "端からの距離（px）", "Deslocamento da borda (px)"],
  ["behavior.desktopMaxWidth", "Maximale Breite auf dem Desktop", "Ancho máximo en escritorio", "Largeur maximale sur ordinateur", "Larghezza massima su desktop", "デスクトップの最大幅", "Largura máxima no desktop"],
  ["plan.brandingHidden", "Branding ausgeblendet", "Marca oculta", "Marque masquée", "Branding nascosto", "ブランド表記は非表示", "Marca oculta"],
  ["plan.brandingVisible", "Branding sichtbar", "Marca visible", "Marque visible", "Branding visibile", "ブランド表記は表示", "Marca visível"],
  ["plan.perMonth", "/Monat", "/mes", "/mois", "/mese", "/月", "/mês"],
  ["plan.proDesc", "Pro entfernt das Label „Powered by Sticky ATC“ und behält alle Stilsteuerungen bei.", "Pro elimina la etiqueta «Powered by Sticky ATC» y mantiene todos los controles de estilo.", "Pro supprime la mention « Powered by Sticky ATC » et conserve toutes les options de style.", "Pro rimuove l’etichetta «Powered by Sticky ATC» e mantiene tutti i controlli di stile.", "Pro では「Powered by Sticky ATC」の表記が非表示になり、スタイル設定もすべて利用できます。", "O Pro remove o rótulo «Powered by Sticky ATC» e mantém todos os controles de estilo."],
  ["plan.freeDesc", "Free enthält die Sticky-Leiste mit einem kleinen Branding-Label. Upgrade, um das Branding zu entfernen.", "Gratis incluye la barra fija con una pequeña etiqueta de marca. Mejora tu plan para quitar la marca.", "L’offre Free inclut la barre fixe avec une petite mention de marque. Passez à l’offre supérieure pour la supprimer.", "Free include la barra fissa con una piccola etichetta di branding. Passa al piano superiore per rimuoverla.", "Free プランにはスティッキーバーが含まれ、小さなブランド表記が表示されます。アップグレードすると表記を非表示にできます。", "O plano Free inclui a barra fixa com um pequeno rótulo de marca. Faça upgrade para remover a marca."],
  ["plan.upgradeCta", "Auf Pro upgraden – $6.99/Monat", "Mejorar a Pro: $6.99/mes", "Passer à Pro – 6,99 $/mois", "Passa a Pro — $6.99/mese", "Pro にアップグレード — $6.99/月", "Fazer upgrade para o Pro — $6.99/mês"],
  ["setup.store", "Shop:", "Tienda:", "Boutique :", "Negozio:", "ストア：", "Loja:"],
  ["setup.openThemeEditor", "Theme-Editor öffnen", "Abrir editor de temas", "Ouvrir l’éditeur de thème", "Apri editor del tema", "テーマエディターを開く", "Abrir editor de temas"],
  ["setup.checklistHeading", "Einstellungen → Storefront-Checkliste", "Ajustes → lista de comprobación de la tienda", "Paramètres → liste de contrôle de la boutique", "Impostazioni → checklist dello storefront", "設定 → ストアフロントのチェックリスト", "Configurações → checklist da loja"],
  ["setup.check1", "App-Embed einmalig im Theme-Editor aktivieren", "Activa el embed de la app una vez en el editor de temas", "Activez une fois l’intégration de l’app dans l’éditeur de thème", "Attiva l’embed dell’app una volta nell’editor del tema", "テーマエディターでアプリ埋め込みを一度有効にする", "Ative o embed do app uma vez no editor de temas"],
  ["setup.check2", "Anzeigestil auf „Warenkorb-Drawer“ stellen (für Drawer und Abfangen des Warenkorbsymbols)", "Configura Estilo de visualización → Panel del carrito (para el panel y la interceptación del icono del carrito)", "Réglez Style d’affichage → Panneau panier (pour le panneau et l’interception de l’icône panier)", "Imposta Stile di visualizzazione → Drawer del carrello (per il drawer e l’intercettazione dell’icona del carrello)", "表示スタイルを「カートドロワー」に設定（ドロワーとカートアイコンの動作に必要）", "Defina Estilo de exibição → Gaveta do carrinho (para a gaveta e a interceptação do ícone do carrinho)"],
  ["setup.check3", "Hier Design / Header / Gestaffelte Belohnungen / Empfehlungen konfigurieren", "Configura aquí Diseño / Encabezado / Recompensas por niveles / Recomendaciones", "Configurez ici Design / En-tête / Récompenses par paliers / Recommandations", "Configura qui Design / Header / Ricompense a livelli / Raccomandazioni", "ここでデザイン／ヘッダー／段階別特典／おすすめを設定する", "Configure aqui Design / Cabeçalho / Recompensas em níveis / Recomendações"],
  ["setup.check4", "Unter „Seiten & Geräte“ die Anzeige für Sticky-Leiste und Warenkorb-Drawer getrennt festlegen", "En Páginas y dispositivos, configura por separado dónde se muestran la barra fija y el panel del carrito", "Sous Pages et appareils, définissez séparément où afficher la barre fixe et le panneau panier", "In Pagine e dispositivi, imposta separatamente dove mostrare la barra fissa e il drawer del carrello", "「ページとデバイス」で、スティッキーバーとカートドロワーの表示設定を個別に行う", "Em Páginas e dispositivos, defina separadamente onde exibir a barra fixa e a gaveta do carrinho"],
  ["setup.check5", "Auf „Einstellungen speichern“ klicken (synchronisiert das Metafield mit dem Storefront)", "Haz clic en Guardar ajustes (sincroniza el metacampo con la tienda)", "Cliquez sur Enregistrer les paramètres (synchronise le métachamp avec la boutique)", "Fai clic su Salva impostazioni (sincronizza il metafield con lo storefront)", "「設定を保存」をクリック（メタフィールドをストアフロントに同期します）", "Clique em Salvar configurações (sincroniza o metacampo com a loja)"],
  ["setup.check6", "Nach dem ersten Speichern überschreiben die Admin-Einstellungen die Farb-/Text-Standards des Theme-Editors für dieses Embed vollständig", "Tras el primer guardado, los ajustes de administración sustituyen por completo los valores predeterminados de color y texto del editor de temas para este embed", "Après le premier enregistrement, les paramètres de l’administration remplacent entièrement les valeurs par défaut de couleur et de texte de l’éditeur de thème pour cette intégration", "Dopo il primo salvataggio, le impostazioni dell’amministrazione sostituiscono completamente i valori predefiniti di colore e testo dell’editor del tema per questo embed", "初回の保存後は、このアプリ埋め込みについて、管理画面の設定がテーマエディターの色／テキストの既定値を完全に上書きします", "Após o primeiro salvamento, as configurações do admin substituem totalmente os padrões de cor/texto do editor de temas para este embed"],
  ["setup.check7", "Storefront hart neu laden (Strg+F5) und dann den Warenkorb-Drawer öffnen", "Recarga la tienda forzando la caché y abre el panel del carrito", "Actualisez la boutique en vidant le cache, puis ouvrez le panneau panier", "Ricarica lo storefront svuotando la cache, poi apri il drawer del carrello", "ストアフロントをスーパーリロードしてから、カートドロワーを開く", "Recarregue a loja ignorando o cache e abra a gaveta do carrinho"],
  ["setup.check8", "So ersetzt du den Theme-Warenkorb-Drawer: Warenkorbtyp des Themes → Seite. Alle Schritte unter „Setup-Hilfe“.", "Para sustituir el panel del carrito del tema: tipo de carrito del tema → Página. Pasos completos en Ayuda de configuración.", "Pour remplacer le panneau panier du thème : type de panier du thème → Page. Étapes complètes dans Aide à la configuration.", "Per sostituire il drawer del carrello del tema: tipo di carrello del tema → Pagina. Passaggi completi in Guida alla configurazione.", "テーマのカートドロワーを置き換えるには、テーマのカートタイプを「ページ」に設定します。詳しい手順は「セットアップヘルプ」をご覧ください。", "Para substituir a gaveta do carrinho do tema: tipo de carrinho do tema → Página. Passos completos em Ajuda de configuração."],
  ["featureTemplate.intro", "Beim Aktivieren wird das integrierte HTML in den Editor kopiert, damit das Layout erhalten bleibt. Bearbeite Klassen/Text oder ergänze eigene – behalte die satc-slider__*-Wrapper und Data-Attribute bei. Platzhalter: {placeholders}", "Al activarlo, el HTML integrado se copia al editor para que el diseño se mantenga intacto. Edita clases/texto o añade los tuyos; conserva los contenedores satc-slider__* y los atributos data. Marcadores: {placeholders}", "Lorsque vous activez cette option, le HTML intégré est copié dans l’éditeur pour que la mise en page reste intacte. Modifiez les classes/le texte ou ajoutez les vôtres ; conservez les conteneurs satc-slider__* et les attributs data. Variables : {placeholders}", "Quando lo attivi, l’HTML integrato viene copiato nell’editor per mantenere intatto il layout. Modifica classi/testo o aggiungi le tue; mantieni i wrapper satc-slider__* e gli attributi data. Segnaposto: {placeholders}", "有効にすると、レイアウトが崩れないよう組み込みの HTML がエディターにコピーされます。クラスやテキストを編集したり独自の内容を追加できますが、satc-slider__* のラッパーと data 属性は残してください。プレースホルダー：{placeholders}", "Ao ativar, o HTML integrado é copiado para o editor para manter o layout intacto. Edite classes/texto ou adicione os seus; mantenha os wrappers satc-slider__* e os atributos data. Marcadores: {placeholders}"],
  ["featureTemplate.featuresAria", "{title}-Funktionen", "Funciones de {title}", "Fonctionnalités de {title}", "Funzioni di {title}", "{title}の機能", "Recursos de {title}"],
  ["featureTemplate.tabOn", " · an", " · activado", " · activé", " · on", " · オン", " · ativado"],
  ["featureTemplate.inactive", "Inaktiv", "Inactivo", "Inactif", "Inattivo", "無効", "Inativo"],
  ["featureTemplate.enableTemplate", "Eigene Vorlage aktivieren", "Activar plantilla personalizada", "Activer le modèle personnalisé", "Attiva template personalizzato", "カスタムテンプレートを有効にする", "Ativar modelo personalizado"],
  ["featureTemplate.disableTemplate", "Eigene Vorlage deaktivieren", "Desactivar plantilla personalizada", "Désactiver le modèle personnalisé", "Disattiva template personalizzato", "カスタムテンプレートを無効にする", "Desativar modelo personalizado"],
  ["featureTemplate.code", "Code", "Código", "Code", "Codice", "コード", "Código"],
  ["featureTemplate.hintHtml", "Standard-HTML bearbeiten… Behalte die satc-slider__*-Klassen bei, damit das Layout intakt bleibt.", "Edita el HTML predeterminado… Conserva las clases satc-slider__* para que el diseño se mantenga intacto.", "Modifiez le HTML par défaut… Conservez les classes satc-slider__* pour que la mise en page reste intacte.", "Modifica l’HTML predefinito… Mantieni le classi satc-slider__* per non alterare il layout.", "デフォルトの HTML を編集…レイアウトを維持するため、satc-slider__* クラスは残してください。", "Edite o HTML padrão… Mantenha as classes satc-slider__* para o layout permanecer intacto."],
  ["featureTemplate.hintCss", "Optionales CSS… Wird automatisch auf diese Funktion begrenzt.", "CSS opcional… Se limita automáticamente a esta función.", "CSS facultatif… Limité automatiquement à cette fonctionnalité.", "CSS facoltativo… Limitato automaticamente a questa funzione.", "任意の CSS…この機能のみに自動的に適用範囲が限定されます。", "CSS opcional… Restrito automaticamente a este recurso."],
  ["featureTemplate.hintJs", "Optionales JS… Wird nach dem Rendern dieser Funktion ausgeführt (root, featureKey, slider).", "JS opcional… Se ejecuta después de renderizar esta función (root, featureKey, slider).", "JS facultatif… S’exécute après le rendu de cette fonctionnalité (root, featureKey, slider).", "JS facoltativo… Viene eseguito dopo il rendering di questa funzione (root, featureKey, slider).", "任意の JS…この機能の描画後に実行されます（root、featureKey、slider）。", "JS opcional… Executa após a renderização deste recurso (root, featureKey, slider)."],
  ["featureTemplate.restoreDefault", "Standard-{kind} wiederherstellen", "Restaurar {kind} predeterminado", "Restaurer le {kind} par défaut", "Ripristina {kind} predefinito", "デフォルトの{kind}を復元", "Restaurar {kind} padrão"],
  ["featureTemplate.clear", "{kind} leeren", "Borrar {kind}", "Effacer le {kind}", "Cancella {kind}", "{kind}をクリア", "Limpar {kind}"],
  ["featureTemplate.resetAll", "Alles zurücksetzen", "Restablecer todo", "Tout réinitialiser", "Reimposta tutto", "すべてリセット", "Redefinir tudo"],
  ["featureTemplate.labels.header", "Header", "Encabezado", "En-tête", "Header", "ヘッダー", "Cabeçalho"],
  ["featureTemplate.labels.announcement", "Ankündigung", "Anuncio", "Annonce", "Annuncio", "お知らせ", "Anúncio"],
  ["featureTemplate.labels.rewards", "Belohnungs-Container", "Contenedor de recompensas", "Conteneur des récompenses", "Contenitore delle ricompense", "特典シェル", "Contêiner de recompensas"],
  ["featureTemplate.labels.rewardTier", "Belohnungsstufe (jeder Meilenstein)", "Nivel de recompensa (cada hito)", "Palier de récompense (chaque palier)", "Livello di ricompensa (ogni traguardo)", "特典ティア（各マイルストーン）", "Nível de recompensa (cada marco)"],
  ["featureTemplate.labels.cartItem", "Warenkorbposition", "Línea de artículo del carrito", "Ligne d’article du panier", "Riga articolo del carrello", "カートの商品行", "Linha de item do carrinho"],
  ["featureTemplate.labels.recommendations", "Empfehlungsblock", "Bloque de recomendaciones", "Bloc de recommandations", "Blocco raccomandazioni", "おすすめブロック", "Bloco de recomendações"],
  ["featureTemplate.labels.recommendationCard", "Empfehlungskachel", "Mosaico de recomendación", "Vignette de recommandation", "Riquadro di raccomandazione", "おすすめタイル", "Cartão de recomendação"],
  ["featureTemplate.labels.recommendationSkeleton", "Platzhalter-Skeleton", "Esqueleto de carga", "Squelette de chargement", "Skeleton di caricamento", "スケルトン", "Esqueleto de carregamento"],
  ["featureTemplate.labels.emptyCart", "Leerer Warenkorb", "Carrito vacío", "Panier vide", "Carrello vuoto", "空のカート", "Carrinho vazio"],
  ["featureTemplate.labels.discount", "Rabattcode", "Código de descuento", "Code de réduction", "Codice sconto", "割引コード", "Código de desconto"],
  ["featureTemplate.labels.trust", "Vertrauenssiegel", "Sellos de confianza", "Badges de confiance", "Badge di fiducia", "信頼バッジ", "Selos de confiança"],
  ["featureTemplate.labels.footer", "Fußzeile / Kasse", "Pie de página / pago", "Pied de page / paiement", "Footer / checkout", "フッター／チェックアウト", "Rodapé / checkout"],
];

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

function getPath(obj, p) {
  return p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj, p, val) {
  const parts = p.split(".");
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!isObj(o[parts[i]])) o[parts[i]] = {};
    o = o[parts[i]];
  }
  o[parts[parts.length - 1]] = val;
}
function leaves(o, p = "", r = []) {
  for (const [k, v] of Object.entries(o)) {
    const q = p ? `${p}.${k}` : k;
    if (isObj(v)) leaves(v, q, r);
    else r.push(q);
  }
  return r;
}
// Build output following en.json key order; keep existing values, fill from T.
function merge(enNode, locNode, langIdx, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(enNode)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (isObj(v)) {
      out[k] = merge(v, isObj(locNode?.[k]) ? locNode[k] : {}, langIdx, p);
    } else if (locNode && k in locNode && !isObj(locNode[k])) {
      out[k] = locNode[k];
    } else {
      const row = MAP.get(p);
      out[k] = row ? row[langIdx] : v;
    }
  }
  return out;
}
const placeholders = (s) =>
  (String(s).match(/\{\{\{?[^}]+\}?\}\}|\{[^}]+\}|\[AMOUNT\]/g) || []).sort().join("|");

const MAP = new Map(T.map((r) => [r[0], r.slice(1)]));
if (MAP.size !== T.length) throw new Error("duplicate keys in translation table");
for (const r of T) if (r.length !== 1 + LANGS.length) throw new Error(`bad row: ${r[0]}`);

const en = JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf8"));
const enKeys = leaves(en);
let failed = false;

// Placeholder sanity check
for (const r of T) {
  const src = getPath(en, r[0]);
  if (src === undefined) {
    console.error(`Key not in en.json: ${r[0]}`);
    failed = true;
    continue;
  }
  LANGS.forEach((l, i) => {
    if (placeholders(src) !== placeholders(r[i + 1])) {
      console.error(`Placeholder mismatch [${l}] ${r[0]}`);
      failed = true;
    }
  });
}
if (failed) process.exit(1);

LANGS.forEach((lang, i) => {
  const file = path.join(dir, `${lang}.json`);
  const cur = JSON.parse(fs.readFileSync(file, "utf8"));
  const before = enKeys.filter((k) => getPath(cur, k) === undefined).length;
  const next = merge(en, cur, i);
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n", "utf8");
  const after = enKeys.filter((k) => getPath(next, k) === undefined).length;
  const stillEn = enKeys.filter(
    (k) => MAP.has(k) && getPath(next, k) === getPath(en, k),
  ).length;
  console.log(`${lang}: missing before=${before} after=${after} (still identical to en among new keys: ${stillEn})`);
});
