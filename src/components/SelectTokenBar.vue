<template>
    <div class="tokenBar">
        <el-select v-model="fromTokenId" @change="changeFromTokenType">
            <el-option v-for="item in fromTokenOptions" :key="item.tokenId" :label="item.tokenSymbol"
                       :value="item.tokenId">
            </el-option>
        </el-select>
        —>
        <el-select v-model="toTokenId" @change="changeToTokenType">
            <el-option v-for="item in toTokenOptions" :key="item.tokenId" :label="item.tokenSymbol"
                       :value="item.tokenId">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        props: {},
        data() {
            return {
                fromTokenId: '',
                //源TOKEN下框列表
                fromTokenOptions: [],
                toTokenId: '',
                //目标TOKEN下框列表
                toTokenOptions: []
            }
        },
        created() {
            this.getTokenList();
        },
        methods: {
            changeFromTokenType() {
                //循环fromTokenOptions数组
                for (let i = 0; i < this.fromTokenOptions.length; i++) {
                    //如果当前点击的数组value等于他自己当前v-model
                    if (this.fromTokenOptions[i].tokenId == this.fromTokenId) {
                        //就把数组label绑定le2list
                        console.log(this.fromTokenOptions[i].switchTokenList)
                        this.toTokenOptions = this.fromTokenOptions[i].switchTokenList;
                        if (this.toTokenOptions.length > 0) {
                            this.toTokenId = this.toTokenOptions[0].tokenId;
                        } else {
                            this.toTokenId = '';
                        }
                    }
                }
                this.$emit('change', this.fromTokenId, this.toTokenId);
            },
            changeToTokenType() {
                this.$emit('change', this.fromTokenId, this.toTokenId);
            },
            /**
             * 获取所有支持兑换代币列表
             */
            getTokenList() {
                this.$get('/v1/token/list', '', {})
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            this.fromTokenOptions = response.result;
                            if (this.fromTokenOptions.length > 0) {
                                this.fromTokenId = this.fromTokenOptions[0].tokenId;
                                this.toTokenOptions = this.fromTokenOptions[0].switchTokenList;
                                if (this.toTokenOptions.length > 0) {
                                    this.toTokenId = this.toTokenOptions[0].tokenId;
                                }
                            }
                            this.$emit('change', this.fromTokenId, this.toTokenId);
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },
        }
    }
</script>