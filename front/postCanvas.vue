<template>
  <view class="page-share-poster" @touchmove.stop="">
    <view class="view-bg" :class="[bgColor]" @click="onClickBg">
        <view class="view-canvas" @click.stop="">
        <!-- style是设置canvas样式的大小 -->
            <canvas style="width: 100%; height: 100%;" type="2d" id="share-poster"></canvas>
        </view>
    </view>
  </view>
</template>

<script>
    export default {
        props: {
            model: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
    data() {
      return {
        bgImage: '', // canvas背景图
        bottomImage: '', // canvas底部图
        hotImage: '', // 已抢小图标
        tagImage: '', // 惊喜价tag标签
        goodsImage: '', // 商品图片
        avatar: '', // 用户头像
        qrCode: '', // 二维码
        shareImg: '', // 分享图片
        bgColor: '', // 背景色
      }
    },
    mounted() {
       this.fxDetail();
    },
    methods: {
      // 点击黑色透明背景隐藏页面
      onClickBg() {
        this.$emit('onHideSharePoster');
      },
      // 保存图片
      onSavePoster() {
        uni.saveImageToPhotosAlbum({
          filePath:this.shareImg,
          success: () => {
            this.$emit('onHideSharePoster');
            uni.showToast({
              title: '图片保存成功'
            });
          },
          fail: (res) => {
            uni.showToast({
              title: '图片保存失败'
            });
          },
        });
      },
      // 获取网络图片
      getImageInfo(src) {
        return new Promise((resolve, reject) => {
          uni.getImageInfo({
            src: src,
            success: (res) => {
              resolve(res.path);
            },
            fail: (err) => {
              uni.hideLoading();
              reject(err);
            }
          })
        })
      },
      // 加载本地图片
      onLoadImage(canvas, src) {
        return new Promise((resolve, reject) => {
          let img = canvas.createImage();
          img.onload = () => {
            resolve(img);
          };
          img.onerror = () => {
            uni.hideLoading();
            reject('');
          }
          img.src = src;
        });
      },
      // canvas实例
      getCtx() {
        return new Promise((resolve, reject) => {
          const query = uni.createSelectorQuery().in(this);
          query.select('#share-poster')
            .fields({ node: true, size: true })
            .exec((res) => {
              const canvas = res[0].node
              const ctx = canvas.getContext('2d')
              
              // 设置canvas大小
              const dpr = uni.getSystemInfoSync().pixelRatio
              canvas.width = res[0].width * dpr
              canvas.height = res[0].height * dpr
              ctx.scale(dpr, dpr)
              
              resolve(canvas);
            })
        });
      },
      // 生成图片
      canvasToTempFilePath(canvas) {
        uni.canvasToTempFilePath({
          canvas: canvas,
          success: (res) => {
            this.shareImg = res.tempFilePath;
            uni.hideLoading();
          },
          fail: (res) => {
            uni.hideLoading();
            this.$emit('onHideSharePoster');
            uni.showToast({
              title: '海报生成失败',
            })
          }
        })
      },

      async fxDetail() {
        uni.showLoading({
          title: '海报生成中...',
        });
        
        const [bgImage, bottomImage, hotImage, tagImage, goodsImage, avatar, qrCode, canvas] = await Promise.all([
          this.getImageInfo('https://img1.iqianggou.com/miniapp/poster_bg.TIeCtE.png').catch(e => e),
          this.getImageInfo('https://img1.iqianggou.com/miniapp/poster_bottom.3C8Awt.png').catch(e => e),
          this.getImageInfo('https://img1.iqianggou.com/miniapp/huo.Jb1aAH.png').catch(e => e),
          this.getImageInfo('https://img1.iqianggou.com/miniapp/qian.8t3Rt5.png').catch(e => e),
          this.getImageInfo(this.model.image).catch(e => e),
          this.getImageInfo(this.userInfo.avatar).catch(e => e),
          this.getImageInfo(this.model.qrimg_url).catch(e => e),
          this.getCtx().catch(e => e),
        ]);
        
        this.bgImage = bgImage;
        this.bottomImage = bottomImage;
        this.hotImage = hotImage;
        this.tagImage = tagImage;
        this.goodsImage = goodsImage;
        this.avatar = avatar;
        this.qrCode = qrCode;
        this.drawFxDetialCanvas(canvas);
      },
      // 开始绘图
      async drawFxDetialCanvas(canvas) {
        // 获取canvas的绘图上下文
        const ctx = canvas.getContext('2d');
        
        const [bgImg, goodsImg, bottomImg, avatar, qrCode, hotImage, tagImage] = await Promise.all([
          this.onLoadImage(canvas, this.bgImage).catch(e => e),
          this.onLoadImage(canvas, this.goodsImage).catch(e => e),
          this.onLoadImage(canvas, this.bottomImage).catch(e => e),
          this.onLoadImage(canvas, this.userInfo.avatar).catch(e => e),
          this.onLoadImage(canvas, this.qrCode).catch(e => e),
          this.onLoadImage(canvas, this.hotImage).catch(e => e),
          this.onLoadImage(canvas, this.tagImage).catch(e => e),
        ]);
        
        // 背景图
        ctx.drawImage(bgImg, 0, 0, 255, 434);
        
        const cardWidth = 225
        
        // 商品区域背景色
        ctx.save();
        this.roundRect(ctx, 15, 15, cardWidth, 300, 10, '#FFFFFF', '#FFFFFF');
        ctx.restore();
        
        // 商品图片
        ctx.save();
        this.roundRect(ctx, 15, 15, cardWidth, cardWidth, 10, '', '', true);
        ctx.drawImage(goodsImg, 15, 15, cardWidth, cardWidth);
        ctx.restore();
        
        // 商品名字
        ctx.textAlign = 'left';
        ctx.font = 'normal bold 11px sans-serif';
        ctx.fillStyle = '#333333';
        this.wordsWrap(ctx, this.model.name, 215, 20, 28 + cardWidth, 16, 2);
        
        // 价格
        // measureText计算文字宽高，要在font之后
        ctx.font = 'normal normal 11px sans-serif';
        ctx.fillStyle = '#FF6D00';
        ctx.fillText('￥', 20, cardWidth + 69, 12);
        ctx.font = 'normal normal 22px sans-serif';
        const priceWidth = Math.min(ctx.measureText(this.model.sale_price).width, 100);
        ctx.fillStyle = '#FF6D00';
        ctx.fillText(this.model.sale_price, 32, cardWidth + 70, priceWidth);
        
        // 惊喜价标签
        ctx.drawImage(tagImage, priceWidth + 42, cardWidth + 57, 46, 14);
        ctx.font = 'normal normal 9px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('惊喜价', priceWidth + 54, cardWidth + 67, 40);
        
        // 正常价
        ctx.font = 'normal normal 8px sans-serif';
        ctx.fillStyle = '#999999';
        ctx.fillText(this.model.market_price, 20, cardWidth + 83, 200);
        // 删除线
        ctx.beginPath();
        ctx.moveTo(20, cardWidth + 80);
        ctx.lineTo(ctx.measureText(this.model.market_price).width + 20, cardWidth + 80);
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 已抢x份
        ctx.font = 'normal normal 7px sans-serif';
        const salesSize = ctx.measureText(this.model.sales_volume);
        const maxSaleWidth = Math.min(salesSize.width, 100);
        const salesBgMinX = 235 - (maxSaleWidth + 30);
        // 背景色
        ctx.save();
        this.roundRect(ctx, salesBgMinX, cardWidth + 70, maxSaleWidth + 25, 14, 7, '#FFF6EA', 'transparent');
        ctx.restore();
        // 小图标
        ctx.drawImage(hotImage, salesBgMinX + 6, cardWidth + 71, 9, 12);
        // 文字
        ctx.fillStyle = '#333333';
        ctx.fillText(this.model.sales_volume, salesBgMinX + 18, cardWidth + 80, maxSaleWidth);
        
        // 底部背景
        ctx.drawImage(bottomImg, 0, 327, 255, 107);
        
        // 微信头像
        ctx.save();
        ctx.beginPath();
        ctx.arc(47, 353, 20, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(avatar, 27, 333, 40, 40);
        ctx.restore();
        
        // 昵称
        ctx.font = 'normal normal 9px sans-serif';
        const userNameWidth = Math.min(ctx.measureText(this.userInfo.username).width, 70);
        ctx.fillStyle = '#333333';        
        this.wordsWrap(ctx, this.userInfo.username, 70, 30, 388, 16, 1);
        
        // 描述
        ctx.font = 'normal normal 9px sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText('发现一家好店', 40 + userNameWidth, 388, 60);
        
        // 二维码
        ctx.save();
        this.roundRect(ctx, 173, 358, 68, 68, 2, 'transparent', '#E1E1E1');
        ctx.restore();
        ctx.drawImage(qrCode, 177, 362, 60, 60);
        
        // 生成图片
        this.canvasToTempFilePath(canvas);
      },
      // 画圆角 ctx、x起点、y起点、w宽度、y高度、r圆角半径、fillColor填充颜色、strokeColor边框颜色
      roundRect(ctx, x, y, w, h, r, fillColor, strokeColor, isTop) {
        // 开始绘制
        ctx.beginPath()
        // 绘制左上角圆弧 Math.PI = 180度
        // 圆心x起点、圆心y起点、半径、以3点钟方向顺时针旋转后确认的起始弧度、以3点钟方向顺时针旋转后确认的终止弧度
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
        // 绘制border-top
        // 移动起点位置 x终点、y终点
        ctx.moveTo(x + r, y)
        // 画一条线 x终点、y终点
        ctx.lineTo(x + w - r, y)
        // self.data.ctx.lineTo(x + w, y + r)
        // 绘制右上角圆弧
        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
        // 绘制border-right
        ctx.lineTo(x + w, y + h - r)
        // 绘制右下角圆弧
        const newR = isTop ? 0 : r;
        ctx.arc(x + w - newR, y + h - newR, newR, 0, Math.PI * 0.5)
        // 绘制border-bottom
        ctx.lineTo(x + r, y + h)
        // 绘制左下角圆弧
        ctx.arc(x + newR, y + h - newR, newR, Math.PI * 0.5, Math.PI)
        // 绘制border-left
        ctx.lineTo(x, y + r)
        if (fillColor) {
          // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
          ctx.fillStyle = fillColor
          // 对绘画区域填充
          ctx.fill()
        }
        if (strokeColor) {
          // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
          ctx.strokeStyle = strokeColor
          // 画出当前路径的边框
          ctx.stroke()
        }
        // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore
        ctx.clip()
      },
      // 文字换行处理
      // canvas 标题超出换行处理
      wordsWrap(ctx, name, maxWidth, startX, srartY, wordsHight, maxLine) {
        let lineWidth = 0;
        let lastSubStrIndex = 0;
        let arr = [];
        for (let i = 0; i < name.length; i++) {
          lineWidth += ctx.measureText(name[i]).width;
          if (lineWidth > maxWidth) {
            arr.push({text: name.substring(lastSubStrIndex, i), startX, srartY});
            srartY += wordsHight;
            lineWidth = 0;
            lastSubStrIndex = I;
          } else if (i == name.length - 1) {
            arr.push({text: name.substring(lastSubStrIndex, i + 1), startX, srartY});
          }
        }
        let textArr = arr.slice(0, maxLine);
        if (arr.length > maxLine) {
          let text = textArr[maxLine - 1]['text'];
          textArr[maxLine - 1]['text'] = text.substring(0, text.length - 2) + '...';
        }
        for (let item of textArr) {
          ctx.fillText(item.text, item.startX, item.srartY);
        }
      },
    },
    }
</script>

<style lang="scss" scoped>
  .page-share-poster {
    .bg-white {
      background-color: #FFFFFF;
    }
    
    .bg-black {
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .view-bg {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    
    .view-canvas {
      position: absolute;
      left: 50%;
      bottom: 60%;
      // 这边宽高不能用rpx， 不然会影响canvas的样式，要跟canvas（px）的单位保持一致
      width: 255px;
      height: 434px;
      margin-left: -127.5px;
      margin-bottom: -217px;
    }
  }
</style>